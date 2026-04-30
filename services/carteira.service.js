const { Carteira, Ativo, Cliente, sequelize } = require('../models');

module.exports = {

  async comprar({ codCliente, codAtivo, qtdeAtivo }) {
    const t = await sequelize.transaction();

    try {
      const cliente = await Cliente.findByPk(codCliente, { transaction: t });
      if (!cliente) throw new Error('Cliente não encontrado');

      const ativo = await Ativo.findByPk(codAtivo, { transaction: t });
      if (!ativo) throw new Error('Ativo não encontrado');

      if (Number(ativo.qtd_corretora) < qtdeAtivo) {
        throw new Error('Quantidade indisponível na corretora');
      }

      const valorTotal = qtdeAtivo * Number(ativo.valor_unitario);

      if (Number(cliente.saldo) < valorTotal) {
        throw new Error('Saldo insuficiente');
      }

      let carteira = await Carteira.findOne({
        where: { id_cliente: codCliente, id_ativo: codAtivo },
        transaction: t
      });

      if (carteira) {
        carteira.quantidade = Number(carteira.quantidade) + qtdeAtivo;
        await carteira.save({ transaction: t });
      } else {
        await Carteira.create({
          id_cliente: codCliente,
          id_ativo: codAtivo,
          quantidade: qtdeAtivo
        }, { transaction: t });
      }

      cliente.saldo = Number(cliente.saldo) - valorTotal;
      await cliente.save({ transaction: t });

      ativo.qtd_corretora = Number(ativo.qtd_corretora) - qtdeAtivo;
      await ativo.save({ transaction: t });

      await t.commit();

    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async vender({ codCliente, codAtivo, qtdeAtivo }) {
    const t = await sequelize.transaction();

    try {
      const carteira = await Carteira.findOne({
        where: { id_cliente: codCliente, id_ativo: codAtivo },
        transaction: t
      });

      if (!carteira) throw new Error('Cliente não possui esse ativo');

      if (Number(carteira.quantidade) < qtdeAtivo) {
        throw new Error('Quantidade insuficiente');
      }

      const ativo = await Ativo.findByPk(codAtivo, { transaction: t });
      const cliente = await Cliente.findByPk(codCliente, { transaction: t });

      const valorTotal = qtdeAtivo * Number(ativo.valor_unitario);

      const novaQtd = Number(carteira.quantidade) - qtdeAtivo;

      if (novaQtd <= 0) {
        await carteira.destroy({ transaction: t });
      } else {
        carteira.quantidade = novaQtd;
        await carteira.save({ transaction: t });
      }

      cliente.saldo = Number(cliente.saldo) + valorTotal;
      await cliente.save({ transaction: t });

      ativo.qtd_corretora = Number(ativo.qtd_corretora) + qtdeAtivo;
      await ativo.save({ transaction: t });

      await t.commit();

    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async listarCarteira(codCliente) {
    const carteira = await Carteira.findAll({
      where: { id_cliente: codCliente },
      include: [{
        model: Ativo,
        attributes: ['id', 'sigla_ativo', 'valor_unitario']
      }]
    });

    return carteira.map(item => ({
      codAtivo: item.id_ativo,
      sigla: item.Ativo.sigla_ativo,
      qtdeAtivo: item.quantidade,
      valor: item.Ativo.valor_unitario
    }));
  },

  async getAtivo(codAtivo) {
    const ativo = await Ativo.findByPk(codAtivo);
    if (!ativo) throw new Error('Ativo não encontrado');
    return ativo;
  }

};