const { Carteira, Ativo, Client, sequelize } = require('../models');

class CarteiraController {

  // 🟢 COMPRAR ATIVO
  async comprarAtivo(req, res) {
    const { codCliente, codAtivo, qtdeAtivo } = req.body;

    if (!codCliente || !codAtivo || !qtdeAtivo) {
      return res.status(400).json({ error: 'Dados obrigatórios não informados' });
    }

    const t = await sequelize.transaction();

    try {
      const cliente = await Client.findByPk(codCliente, { transaction: t });
      const ativo = await Ativo.findByPk(codAtivo, { transaction: t });

      if (!cliente || !ativo) throw new Error('Cliente ou Ativo não encontrado');

      // Note: Verifique se no seu banco o campo é 'quantidade_corretora' ou 'qtd_corretora'
      if (Number(ativo.quantidade_corretora) < qtdeAtivo) {
        throw new Error('Quantidade indisponível na corretora');
      }

      const valorTotal = qtdeAtivo * Number(ativo.valor_unitario);

      if (Number(cliente.saldo) < valorTotal) {
        throw new Error('Saldo insuficiente');
      }

      // Localiza ou cria o registro na carteira
      let [carteira] = await Carteira.findOrCreate({
        where: { id_cliente: codCliente, id_ativo: codAtivo },
        defaults: { quantidade: 0 },
        transaction: t
      });

      // Atualiza os valores
      carteira.quantidade = Number(carteira.quantidade) + Number(qtdeAtivo);
      cliente.saldo = Number(cliente.saldo) - valorTotal;
      ativo.quantidade_corretora = Number(ativo.quantidade_corretora) - qtdeAtivo;

      await carteira.save({ transaction: t });
      await cliente.save({ transaction: t });
      await ativo.save({ transaction: t });

      await t.commit();

      return res.json({
        success: true,
        message: 'Compra realizada com sucesso',
        saldoRestante: cliente.saldo
      });

    } catch (err) {
      await t.rollback();
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 🔴 VENDER ATIVO
  async venderAtivo(req, res) {
    const { codCliente, codAtivo, qtdeAtivo } = req.body;

    const t = await sequelize.transaction();

    try {
      const carteira = await Carteira.findOne({
        where: { id_cliente: codCliente, id_ativo: codAtivo },
        transaction: t
      });

      if (!carteira || Number(carteira.quantidade) < qtdeAtivo) {
        throw new Error('Quantidade insuficiente para venda');
      }

      const ativo = await Ativo.findByPk(codAtivo, { transaction: t });
      const cliente = await Client.findByPk(codCliente, { transaction: t });

      const valorTotal = qtdeAtivo * Number(ativo.valor_unitario);

      carteira.quantidade = Number(carteira.quantidade) - qtdeAtivo;
      cliente.saldo = Number(cliente.saldo) + valorTotal;
      ativo.quantidade_corretora = Number(ativo.quantidade_corretora) + qtdeAtivo;

      if (Number(carteira.quantidade) === 0) {
        await carteira.destroy({ transaction: t });
      } else {
        await carteira.save({ transaction: t });
      }

      await cliente.save({ transaction: t });
      await ativo.save({ transaction: t });

      await t.commit();

      return res.json({
        success: true,
        message: 'Venda realizada com sucesso',
        novoSaldo: cliente.saldo
      });

    } catch (err) {
      await t.rollback();
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // 👤 LISTAR CARTEIRA COM NOME DO DONO
  async getCarteiraCliente(req, res) {
    const { codCliente } = req.params;

    try {
      const carteira = await Carteira.findAll({
        where: { id_cliente: codCliente },
        include: [
          {
            model: Ativo,
            attributes: ['sigla_ativo', 'valor_unitario']
          },
          {
            model: Client,
            attributes: ['nome', 'saldo']
          }
        ]
      });

      if (carteira.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Carteira vazia ou cliente não encontrado"
        });
      }

      // Extrai os dados do cliente do primeiro item da lista
      const nomeDono = carteira[0].Client ? carteira[0].Client.nome : 'Cliente';
      const saldoDono = carteira[0].Client ? carteira[0].Client.saldo : 0;

      const ativosFormatados = carteira.map(item => ({
        codAtivo: item.id_ativo,
        sigla: item.Ativo ? item.Ativo.sigla_ativo : 'N/A',
        quantidade: item.quantidade,
        valorUnitario: item.Ativo ? item.Ativo.valor_unitario : 0,
        totalInvestido: (Number(item.quantidade) * Number(item.Ativo ? item.Ativo.valor_unitario : 0)).toFixed(2)
      }));

      return res.json({
        success: true,
        cliente: nomeDono,
        saldoEmConta: saldoDono,
        data: ativosFormatados
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
}

module.exports = new CarteiraController();
