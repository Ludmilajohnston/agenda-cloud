const SUPABASE_URL =
  "https://kkbnekygfwizviapvcfo.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_3Fi7MWfPTdKXOVAF_AxkGw_1QT4xTKm";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let contatoEditando = null;

async function listarContatos() {

  try {

    const { data, error } = await client
      .from("contato")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    const lista =
      document.getElementById("listaContatos");

    lista.innerHTML = "";

    data.forEach((contato) => {

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${contato.nome}</td>
        <td>${contato.telefone}</td>
        <td>${contato.email}</td>

        <td>
          <button class="editar">
            ✏️
          </button>

          <button class="excluir">
            🗑️
          </button>
        </td>
      `;

      tr.querySelector(".editar")
        .addEventListener("click", () => {

          editarContato(
            contato.id,
            contato.nome,
            contato.telefone,
            contato.email
          );

        });

      tr.querySelector(".excluir")
        .addEventListener("click", () => {

          excluirContato(contato.id);

        });

      lista.appendChild(tr);

    });

  } catch (err) {

    console.error(err);

    alert("Erro ao carregar contatos.");

  }
}

async function salvarContato() {

  const nome =
    document.getElementById("nome")
      .value
      .trim();

  const telefone =
    document.getElementById("telefone")
      .value
      .trim();

  const email =
    document.getElementById("email")
      .value
      .trim();

  if (!nome || !telefone || !email) {

    alert("Preencha todos os campos.");

    return;
  }

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValido.test(email)) {

    alert("E-mail inválido.");

    return;
  }

  try {

    const btn =
      document.getElementById("btnSalvar");

    btn.disabled = true;

    btn.textContent = "Salvando...";

    let response;

    if (contatoEditando !== null) {

      response = await client
        .from("contato")
        .update({
          nome,
          telefone,
          email
        })
        .eq("id", contatoEditando);

    } else {

      response = await client
        .from("contato")
        .insert([
          {
            nome,
            telefone,
            email
          }
        ]);

    }

    if (response.error) {
      throw response.error;
    }

    const mensagem =
      contatoEditando !== null
        ? "Contato atualizado!"
        : "Contato salvo!";

    limparFormulario();

    await listarContatos();

    alert(mensagem);

  } catch (err) {

    console.error(err);

    alert("Erro ao salvar contato.");

  } finally {

    const btn =
      document.getElementById("btnSalvar");

    btn.disabled = false;

    btn.textContent =
      contatoEditando !== null
        ? "Atualizar"
        : "Salvar";
  }
}

function editarContato(
  id,
  nome,
  telefone,
  email
) {

  contatoEditando = id;

  document.getElementById("nome").value =
    nome;

  document.getElementById("telefone").value =
    telefone;

  document.getElementById("email").value =
    email;

  document.getElementById("btnSalvar")
    .textContent = "Atualizar";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function excluirContato(id) {

  const confirmar =
    confirm(
      "Deseja realmente excluir este contato?"
    );

  if (!confirmar) {
    return;
  }

  try {

    const { error } = await client
      .from("contato")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    await listarContatos();

    alert("Contato excluído!");

  } catch (err) {

    console.error(err);

    alert("Erro ao excluir contato.");
  }
}

function limparFormulario() {

  contatoEditando = null;

  document.getElementById("nome").value =
    "";

  document.getElementById("telefone").value =
    "";

  document.getElementById("email").value =
    "";

  document.getElementById("btnSalvar")
    .textContent = "Salvar";
}

listarContatos();
