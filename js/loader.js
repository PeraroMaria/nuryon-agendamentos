/*  loader.js
 *  Lê ?empresa=ID na URL, busca o JSON da empresa
 *  e preenche o conteúdo da página empresa.html
 */

(function () {
  // --- 1. Descobre o ID da empresa ---
  const params    = new URLSearchParams(window.location.search);
  const empresaId = params.get("empresa");

  // Se não veio parâmetro, mostra erro simples
  if (!empresaId) {
    document.body.innerHTML = "<h2 style='text-align:center;color:#c00;margin-top:2rem'>Empresa não especificada na URL.</h2>";
    return;
  }

  // --- 2. Busca o JSON correspondente ---
  fetch(`empresas/${empresaId}.json`)
    .then(r => {
      if (!r.ok) throw new Error("Empresa não encontrada.");
      return r.json();
    })
    .then(data => preencherTela(data))
    .catch(err => {
      document.body.innerHTML = `<h2 style='text-align:center;color:#c00;margin-top:2rem'>${err.message}</h2>`;
      console.error(err);
    });

  // --- 3. Preenche todos os campos da página ---
  function preencherTela(d) {
    // Tema de cor (opcional no JSON)
    if (d.tema) {
      document.documentElement.style.setProperty("--bs-primary", d.tema);
    }

    // Cabeçalho
    document.getElementById("logoEmpresa").src        = `img/${d.logo}`;
    document.getElementById("nomeEmpresa").innerText   = d.nome;
    document.getElementById("descricaoEmpresa").innerText = d.descricao || "";

    // Imagem principal
    document.getElementById("imgEstabelecimento").src  = `img/${d.imagem}`;

    // Facilidades
    const facWrap = document.getElementById("facilidadesList");
    (d.facilidades || []).forEach(f => {
      const p = document.createElement("p");
      p.innerHTML = `<i class="fas fa-check facility-icon"></i>${f}`;
      facWrap.appendChild(p);
    });

    // Pagamentos
    const pagWrap = document.getElementById("pagamentosList");
    (d.pagamentos || []).forEach(p => {
      const div = document.createElement("p");
      div.innerHTML = `<i class="fas fa-credit-card payment-icon"></i>${p}`;
      pagWrap.appendChild(div);
    });

    // Endereço e contatos
    document.getElementById("enderecoEmpresa").innerText  = d.endereco || "-";
    document.getElementById("telefoneEmpresa").innerText  = d.telefone || "-";
    const waLink = document.getElementById("whatsappEmpresa");
    waLink.href  = `https://wa.me/${d.whatsapp}`;
    waLink.innerText = formataTel(d.whatsapp);

    // Horários
    const horarios = document.getElementById("horariosEmpresa");
    (d.horarios || []).forEach(h => {
      const p = document.createElement("p");
      p.innerText = h;
      horarios.appendChild(p);
    });

    // Serviços rápidos (até 4)
    const ulServ = document.getElementById("lista-servicos");
    (d.servicos || []).slice(0, 4).forEach(s => {
      const li = document.createElement("li");
      li.innerText = `• ${s.nome}`;
      ulServ.appendChild(li);
    });

    // Guarda JSON inteiro em localStorage para as próximas telas
    localStorage.setItem("jsonEmpresa", JSON.stringify(d));
  }

  // util para telefone
  function formataTel(tel) {
    return tel.replace(/^55/, "+55 ");
  }
})();
