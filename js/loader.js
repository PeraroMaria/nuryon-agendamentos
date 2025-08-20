// loader.js
// Carrega dados de uma empresa com base no parâmetro da URL (?empresa=ID)

(function () {
  // 1. Coleta o ID da empresa pela URL
  const params = new URLSearchParams(window.location.search);
  const empresaId = params.get("empresa");

  if (!empresaId) {
    document.body.innerHTML = "<h2 style='text-align:center;color:#c00;margin-top:2rem'>Empresa não especificada na URL.</h2>";
    return;
  }

  // 2. Busca os dados da empresa via JSON
  fetch(`../../empresas/${empresaId}.json`)
    .then(response => {
      if (!response.ok) throw new Error("Empresa não encontrada.");
      return response.json();
    })
    .then(data => preencherDados(data))
    .catch(err => {
      document.body.innerHTML = `<h2 style='text-align:center;color:#c00;margin-top:2rem'>${err.message}</h2>`;
      console.error("Erro ao carregar empresa:", err);
    });

  // 3. Preenche os dados na página HTML
  function preencherDados(dados) {
    // Aplica cor do tema (se definido no JSON)
    if (dados.tema) {
      document.documentElement.style.setProperty("--bs-primary", dados.tema);
    }

    // Cabeçalho
    document.getElementById("logoEmpresa").src = `../../imagens/${empresaId}/${dados.logo}`;
    document.getElementById("nomeEmpresa").innerText = dados.nome || "Sem nome";
    document.getElementById("descricaoEmpresa").innerText = dados.descricao || "";

    // Imagem principal
    document.getElementById("imgEstabelecimento").src = `../../imagens/${empresaId}/${dados.imagem}`;

    // Facilidades
    const facilidades = dados.facilidades || [];
    const facilidadesEl = document.getElementById("facilidadesList");
    if (facilidadesEl) {
      facilidadesEl.innerHTML = "";
      facilidades.forEach(item => {
        const p = document.createElement("p");
        p.innerHTML = `<i class="fas fa-check facility-icon"></i> ${item}`;
        facilidadesEl.appendChild(p);
      });
    }

    // Pagamentos
    const pagamentos = dados.pagamentos || [];
    const pagamentosEl = document.getElementById("pagamentosList");
    if (pagamentosEl) {
      pagamentosEl.innerHTML = "";
      pagamentos.forEach(item => {
        const p = document.createElement("p");
        p.innerHTML = `<i class="fas fa-credit-card payment-icon"></i> ${item}`;
        pagamentosEl.appendChild(p);
      });
    }

    // Serviços em destaque (opcional)
    const servicos = dados.servicos || [];
    const servicosEl = document.getElementById("lista-servicos");
    if (servicosEl) {
      servicosEl.innerHTML = "";
      servicos.slice(0, 4).forEach(servico => {
        const li = document.createElement("li");
        li.innerText = `• ${servico.nome || servico}`;
        servicosEl.appendChild(li);
      });
    }

    // Endereço e Contatos
    document.getElementById("enderecoEmpresa").innerText = dados.endereco || "-";
    document.getElementById("telefoneEmpresa").innerText = dados.telefone || "-";

    const waLink = document.getElementById("whatsappEmpresa");
    waLink.href = `https://wa.me/${dados.whatsapp?.replace(/\D/g, "")}`;
    waLink.innerText = formatarTelefone(dados.whatsapp);

    // Horários de funcionamento
    const horarios = dados.horarios || [];
    const horariosEl = document.getElementById("horariosEmpresa");
    if (horariosEl) {
      horariosEl.innerHTML = "";
      horarios.forEach(item => {
        const p = document.createElement("p");
        if (typeof item === "string") {
          p.innerText = item;
        } else {
          p.innerText = `${item.dia || ""}: ${item.horas || ""}`;
        }
        horariosEl.appendChild(p);
      });
    }

    // Salva o JSON completo no localStorage para uso nas próximas telas
    localStorage.setItem(empresaId, JSON.stringify(dados));

    // Redireciona com o parâmetro da empresa
    const btn = document.getElementById("btnAgendar");
    if (btn) {
      btn.href = `${dados.btn_agendamento?.link || "tela1.html"}?empresa=${empresaId}`;
      btn.innerText = dados.btn_agendamento?.texto || "Agendar";
    }

  }

  // 4. Função auxiliar para formatar o número do WhatsApp
  function formatarTelefone(tel) {
    if (!tel) return "-";
    tel = tel.replace(/\D/g, "");
    if (tel.startsWith("55")) tel = "+" + tel;
    return tel.replace(/^(\+\d{2})(\d{2})(\d{5})(\d{4})$/, "$1 ($2) $3-$4");
  }
})();
