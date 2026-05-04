import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownUp,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Pencil,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  TrendingUp,
  X,
  UserPlus,
  Wallet,
} from "lucide-react";
import "./styles.css";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const number = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 8,
});

const emptyForms = {
  cliente: { nome: "", email: "", senha: "", saldo: "" },
  ativo: { sigla_ativo: "", quantidade_corretora: "", valor_unitario: "" },
  ordem: { codCliente: "", codAtivo: "", qtdeAtivo: "", tipo: "comprar" },
};

async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Erro na requisicao");
  }

  return data;
}

function App() {
  const [clientes, setClientes] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [carteira, setCarteira] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [forms, setForms] = useState(emptyForms);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [filter, setFilter] = useState("");
  const [editingAtivoId, setEditingAtivoId] = useState(null);
  const [editAtivoForm, setEditAtivoForm] = useState(emptyForms.ativo);
  const [editingSaldoClientId, setEditingSaldoClientId] = useState(null);
  const [editSaldoValue, setEditSaldoValue] = useState("");

  const loadBase = async () => {
    setLoading(true);
    try {
      const [clientesData, ativosData] = await Promise.all([
        request("/client"),
        request("/ativo"),
      ]);
      setClientes(clientesData || []);
      setAtivos(ativosData || []);

      const currentClient = selectedClient || clientesData?.[0]?.id || "";
      setSelectedClient(currentClient);
      if (currentClient) {
        await loadCarteira(currentClient, false);
      }
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loadCarteira = async (clientId = selectedClient, showErrors = true) => {
    if (!clientId) {
      setCarteira(null);
      return;
    }

    try {
      const data = await request(`/carteira/${clientId}`);
      setCarteira(data);
      if (showErrors) setNotice({ type: "success", message: "Carteira atualizada." });
    } catch (error) {
      setCarteira(null);
      if (showErrors) setNotice({ type: "error", message: error.message });
    }
  };

  useEffect(() => {
    loadBase();
  }, []);

  const portfolioTotal = useMemo(() => {
    return (carteira?.data || []).reduce((sum, item) => sum + Number(item.totalInvestido), 0);
  }, [carteira]);

  const saldoTotal = useMemo(() => {
    return clientes.reduce((sum, client) => sum + Number(client.saldo || 0), 0);
  }, [clientes]);

  const filteredAtivos = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return ativos;
    return ativos.filter((ativo) => ativo.sigla_ativo.toLowerCase().includes(term));
  }, [ativos, filter]);

  const selectedClientData = clientes.find((client) => String(client.id) === String(selectedClient));

  const updateForm = (form, field, value) => {
    setForms((current) => ({
      ...current,
      [form]: { ...current[form], [field]: value },
    }));
  };

  const submitCliente = async (event) => {
    event.preventDefault();
    await runAction("cliente", async () => {
      await request("/client", {
        method: "POST",
        body: JSON.stringify({
          ...forms.cliente,
          saldo: Number(forms.cliente.saldo || 0),
        }),
      });
      setForms((current) => ({ ...current, cliente: emptyForms.cliente }));
      setNotice({ type: "success", message: "Cliente cadastrado com sucesso." });
      await loadBase();
    });
  };

  const submitAtivo = async (event) => {
    event.preventDefault();
    await runAction("ativo", async () => {
      await request("/ativo", {
        method: "POST",
        body: JSON.stringify({
          sigla_ativo: forms.ativo.sigla_ativo.toUpperCase(),
          quantidade_corretora: Number(forms.ativo.quantidade_corretora),
          valor_unitario: Number(forms.ativo.valor_unitario),
        }),
      });
      setForms((current) => ({ ...current, ativo: emptyForms.ativo }));
      setNotice({ type: "success", message: "Ativo cadastrado com sucesso." });
      await loadBase();
    });
  };

  const startEditingAtivo = (ativo) => {
    setEditingAtivoId(ativo.id);
    setEditAtivoForm({
      sigla_ativo: ativo.sigla_ativo,
      quantidade_corretora: ativo.quantidade_corretora,
      valor_unitario: ativo.valor_unitario,
    });
  };

  const cancelEditingAtivo = () => {
    setEditingAtivoId(null);
    setEditAtivoForm(emptyForms.ativo);
  };

  const updateEditAtivo = (field, value) => {
    setEditAtivoForm((current) => ({ ...current, [field]: value }));
  };

  const submitEditAtivo = async (event, ativoId) => {
    event.preventDefault();
    await runAction(`editar-ativo-${ativoId}`, async () => {
      await request(`/ativo/${ativoId}`, {
        method: "PUT",
        body: JSON.stringify({
          sigla_ativo: editAtivoForm.sigla_ativo.toUpperCase(),
          quantidade_corretora: Number(editAtivoForm.quantidade_corretora),
          valor_unitario: Number(editAtivoForm.valor_unitario),
        }),
      });
      cancelEditingAtivo();
      setNotice({ type: "success", message: "Ativo atualizado com sucesso." });
      await loadBase();
    });
  };

  const startEditingSaldo = () => {
    if (!selectedClientData) return;
    setEditingSaldoClientId(selectedClientData.id);
    setEditSaldoValue(carteira?.saldoEmConta ?? selectedClientData.saldo ?? "");
  };

  const cancelEditingSaldo = () => {
    setEditingSaldoClientId(null);
    setEditSaldoValue("");
  };

  const submitEditSaldo = async (event) => {
    event.preventDefault();
    if (!editingSaldoClientId) return;

    await runAction("saldo", async () => {
      await request(`/client/${editingSaldoClientId}`, {
        method: "PUT",
        body: JSON.stringify({ saldo: Number(editSaldoValue || 0) }),
      });
      cancelEditingSaldo();
      setNotice({ type: "success", message: "Saldo do investidor atualizado." });
      await loadBase();
      await loadCarteira(editingSaldoClientId, false);
    });
  };

  const submitOrdem = async (event) => {
    event.preventDefault();
    const endpoint =
      forms.ordem.tipo === "comprar"
        ? "/carteira/investimento/comprar"
        : "/carteira/investimento/vender";

    await runAction("ordem", async () => {
      await request(endpoint, {
        method: "POST",
        body: JSON.stringify({
          codCliente: Number(forms.ordem.codCliente),
          codAtivo: Number(forms.ordem.codAtivo),
          qtdeAtivo: Number(forms.ordem.qtdeAtivo),
        }),
      });
      setSelectedClient(forms.ordem.codCliente);
      setForms((current) => ({ ...current, ordem: { ...emptyForms.ordem, codCliente: forms.ordem.codCliente } }));
      setNotice({ type: "success", message: "Ordem executada com sucesso." });
      await loadBase();
      await loadCarteira(forms.ordem.codCliente, false);
    });
  };

  const runAction = async (action, callback) => {
    setBusyAction(action);
    setNotice({ type: "", message: "" });
    try {
      await callback();
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setBusyAction("");
    }
  };

  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,77,145,0.28),transparent_30%),linear-gradient(135deg,rgba(7,27,58,0.76),rgba(5,6,8,0.94)_42%,#050608)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <Header loading={loading} onRefresh={loadBase} />

        {notice.message && <Notice notice={notice} />}

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={Wallet}
            label="Saldo em clientes"
            value={currency.format(saldoTotal)}
            detail={`${clientes.length} clientes cadastrados`}
          />
          <MetricCard
            icon={BriefcaseBusiness}
            label="Valor em carteira"
            value={currency.format(portfolioTotal)}
            detail={carteira?.cliente || "Selecione um cliente"}
          />
          <MetricCard
            icon={BarChart3}
            label="Ativos na corretora"
            value={String(ativos.length)}
            detail="Disponiveis para compra e venda"
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Carteira do cliente" icon={Shield}>
            <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="field">
                <span>Cliente</span>
                <select
                  value={selectedClient}
                  onChange={(event) => {
                    setSelectedClient(event.target.value);
                    loadCarteira(event.target.value);
                  }}
                >
                  <option value="">Selecione</option>
                  {clientes.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nome}
                    </option>
                  ))}
                </select>
              </label>
              <button className="action-button self-end" type="button" onClick={() => loadCarteira()}>
                <RefreshCw size={18} />
                Atualizar
              </button>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <MiniStat label="Cliente" value={carteira?.cliente || selectedClientData?.nome || "-"} />
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                {editingSaldoClientId ? (
                  <form className="grid gap-3" onSubmit={submitEditSaldo}>
                    <label className="field">
                      <span>Saldo em conta</span>
                      <input
                        required
                        min="0"
                        step="0.01"
                        type="number"
                        value={editSaldoValue}
                        onChange={(event) => setEditSaldoValue(event.target.value)}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={cancelEditingSaldo}
                        disabled={busyAction === "saldo"}
                      >
                        <X size={17} />
                        Cancelar
                      </button>
                      <button className="action-button" type="submit" disabled={busyAction === "saldo"}>
                        {busyAction === "saldo" ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
                        Salvar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-white/40">Saldo em conta</p>
                        <strong className="mt-2 block text-base text-white">
                          {currency.format(Number(carteira?.saldoEmConta ?? selectedClientData?.saldo ?? 0))}
                        </strong>
                      </div>
                      <button
                        className="icon-button"
                        type="button"
                        aria-label="Editar saldo do investidor"
                        title="Editar saldo do investidor"
                        onClick={startEditingSaldo}
                        disabled={!selectedClientData}
                      >
                        <Pencil size={17} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-white/55">
                  <tr>
                    <th className="px-4 py-3">Ativo</th>
                    <th className="px-4 py-3">Quantidade</th>
                    <th className="px-4 py-3">Valor unitario</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {(carteira?.data || []).map((item) => (
                    <tr key={item.codAtivo} className="bg-black/20">
                      <td className="px-4 py-4 font-semibold text-white">{item.sigla}</td>
                      <td className="px-4 py-4 text-white/70">{number.format(Number(item.quantidade))}</td>
                      <td className="px-4 py-4 text-white/70">{currency.format(Number(item.valorUnitario))}</td>
                      <td className="px-4 py-4 text-right font-semibold text-white">
                        {currency.format(Number(item.totalInvestido))}
                      </td>
                    </tr>
                  ))}
                  {!carteira?.data?.length && (
                    <tr>
                      <td className="px-4 py-8 text-center text-white/55" colSpan="4">
                        Nenhum ativo em carteira para exibir.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Nova ordem" icon={ArrowDownUp}>
            <form className="grid gap-4" onSubmit={submitOrdem}>
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-white/[0.04] p-1">
                {["comprar", "vender"].map((tipo) => (
                  <button
                    key={tipo}
                    className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                      forms.ordem.tipo === tipo ? "bg-cobalt text-white" : "text-white/60 hover:text-white"
                    }`}
                    type="button"
                    onClick={() => updateForm("ordem", "tipo", tipo)}
                  >
                    {tipo === "comprar" ? "Compra" : "Venda"}
                  </button>
                ))}
              </div>
              <label className="field">
                <span>Cliente</span>
                <select
                  required
                  value={forms.ordem.codCliente}
                  onChange={(event) => updateForm("ordem", "codCliente", event.target.value)}
                >
                  <option value="">Selecione</option>
                  {clientes.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Ativo</span>
                <select
                  required
                  value={forms.ordem.codAtivo}
                  onChange={(event) => updateForm("ordem", "codAtivo", event.target.value)}
                >
                  <option value="">Selecione</option>
                  {ativos.map((ativo) => (
                    <option key={ativo.id} value={ativo.id}>
                      {ativo.sigla_ativo} - {currency.format(Number(ativo.valor_unitario))}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Quantidade</span>
                <input
                  required
                  min="0.00000001"
                  step="0.00000001"
                  type="number"
                  value={forms.ordem.qtdeAtivo}
                  onChange={(event) => updateForm("ordem", "qtdeAtivo", event.target.value)}
                />
              </label>
              <SubmitButton busy={busyAction === "ordem"} label="Executar ordem" />
            </form>
          </Panel>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel title="Cadastrar cliente" icon={UserPlus}>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitCliente}>
              <label className="field sm:col-span-2">
                <span>Nome</span>
                <input required value={forms.cliente.nome} onChange={(event) => updateForm("cliente", "nome", event.target.value)} />
              </label>
              <label className="field">
                <span>Email</span>
                <input required type="email" value={forms.cliente.email} onChange={(event) => updateForm("cliente", "email", event.target.value)} />
              </label>
              <label className="field">
                <span>Senha</span>
                <input required type="password" value={forms.cliente.senha} onChange={(event) => updateForm("cliente", "senha", event.target.value)} />
              </label>
              <label className="field sm:col-span-2">
                <span>Saldo inicial</span>
                <input min="0" step="0.01" type="number" value={forms.cliente.saldo} onChange={(event) => updateForm("cliente", "saldo", event.target.value)} />
              </label>
              <div className="sm:col-span-2">
                <SubmitButton busy={busyAction === "cliente"} label="Adicionar cliente" />
              </div>
            </form>
          </Panel>

          <Panel title="Cadastrar ativo" icon={Plus}>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitAtivo}>
              <label className="field sm:col-span-2">
                <span>Sigla</span>
                <input required maxLength="10" value={forms.ativo.sigla_ativo} onChange={(event) => updateForm("ativo", "sigla_ativo", event.target.value)} />
              </label>
              <label className="field">
                <span>Quantidade corretora</span>
                <input required min="0" step="0.01" type="number" value={forms.ativo.quantidade_corretora} onChange={(event) => updateForm("ativo", "quantidade_corretora", event.target.value)} />
              </label>
              <label className="field">
                <span>Valor unitario</span>
                <input required min="0" step="0.01" type="number" value={forms.ativo.valor_unitario} onChange={(event) => updateForm("ativo", "valor_unitario", event.target.value)} />
              </label>
              <div className="sm:col-span-2">
                <SubmitButton busy={busyAction === "ativo"} label="Adicionar ativo" />
              </div>
            </form>
          </Panel>
        </section>

        <Panel title="Ativos disponiveis" icon={TrendingUp}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                className="w-full rounded-lg border border-white/10 bg-black/35 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cobalt"
                placeholder="Buscar sigla"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              />
            </div>
            <span className="text-sm text-white/50">{filteredAtivos.length} ativos encontrados</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filteredAtivos.map((ativo) => (
              <article key={ativo.id} className="rounded-lg border border-white/10 bg-black/35 p-4 shadow-glow">
                {editingAtivoId === ativo.id ? (
                  <form className="grid gap-3" onSubmit={(event) => submitEditAtivo(event, ativo.id)}>
                    <label className="field">
                      <span>Sigla</span>
                      <input
                        required
                        maxLength="10"
                        value={editAtivoForm.sigla_ativo}
                        onChange={(event) => updateEditAtivo("sigla_ativo", event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Quantidade</span>
                      <input
                        required
                        min="0"
                        step="0.01"
                        type="number"
                        value={editAtivoForm.quantidade_corretora}
                        onChange={(event) => updateEditAtivo("quantidade_corretora", event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Valor unitario</span>
                      <input
                        required
                        min="0"
                        step="0.01"
                        type="number"
                        value={editAtivoForm.valor_unitario}
                        onChange={(event) => updateEditAtivo("valor_unitario", event.target.value)}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={cancelEditingAtivo}
                        disabled={busyAction === `editar-ativo-${ativo.id}`}
                      >
                        <X size={17} />
                        Cancelar
                      </button>
                      <button
                        className="action-button"
                        type="submit"
                        disabled={busyAction === `editar-ativo-${ativo.id}`}
                      >
                        {busyAction === `editar-ativo-${ativo.id}` ? (
                          <Loader2 className="animate-spin" size={17} />
                        ) : (
                          <Save size={17} />
                        )}
                        Salvar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <strong className="text-lg text-white">{ativo.sigla_ativo}</strong>
                      <button
                        className="icon-button"
                        type="button"
                        aria-label={`Editar ${ativo.sigla_ativo}`}
                        title={`Editar ${ativo.sigla_ativo}`}
                        onClick={() => startEditingAtivo(ativo)}
                      >
                        <Pencil size={17} />
                      </button>
                    </div>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cobalt/20 text-sky-200">
                      <CircleDollarSign size={22} />
                    </div>
                    <p className="text-sm text-white/50">Preco unitario</p>
                    <p className="mt-1 text-xl font-bold text-white">{currency.format(Number(ativo.valor_unitario))}</p>
                    <div className="mt-4 rounded-md bg-navy/80 px-3 py-2 text-sm text-white/70">
                      {number.format(Number(ativo.quantidade_corretora))} disponiveis
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}

function Header({ loading, onRefresh }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">XP Thais</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-white sm:text-4xl">Painel de investimentos</h1>
      </div>
      <button className="action-button" type="button" onClick={onRefresh} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        Sincronizar API
      </button>
    </header>
  );
}

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/45 p-5 shadow-glow">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-sky-200">
        <Icon size={20} />
      </div>
      <p className="text-sm text-white/50">{label}</p>
      <strong className="mt-2 block text-2xl font-bold text-white">{value}</strong>
      <span className="mt-2 block text-sm text-white/45">{detail}</span>
    </article>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-lg border border-white/10 bg-graphite/85 p-5 shadow-glow">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cobalt/20 text-sky-200">
          <Icon size={19} />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-white/40">{label}</p>
      <strong className="mt-2 block text-base text-white">{value}</strong>
    </div>
  );
}

function Notice({ notice }) {
  const isError = notice.type === "error";
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
        isError
          ? "border-red-400/25 bg-red-500/10 text-red-100"
          : "border-sky-300/25 bg-cobalt/20 text-sky-50"
      }`}
    >
      <CheckCircle2 size={18} />
      {notice.message}
    </div>
  );
}

function SubmitButton({ busy, label }) {
  return (
    <button className="action-button w-full justify-center" type="submit" disabled={busy}>
      {busy ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
      {label}
    </button>
  );
}

createRoot(document.getElementById("root")).render(<App />);
