const SUPABASE_URL = "https://kkbnekygfwizviapvcfo.supabase.co";
const SUPABASE_KEY = "Ssb_publishable_3Fi7MWfPTdKXOVAF_AxkGw_1QT4xTKm";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let contatoEditando = null;

async function listarContatos(){

  const { data, error } = await client
    .from("contato")
    .select("*")
    .order("id", { ascending: true });

  if(error){
    console.log(error);
    alert("Erro ao carregar contatos");
    return;
  }

  const lista = document.getElementById("listaContatos");

  lista.innerHTML = "";

  data.forEach(contato => {

    lista.innerHTML += `
      <tr>

        <td>${contato.nome}</td>

        <td>${contato.telefone}</td>

        <td>${contato.email}</td>

        <td>

          <button onclick="editarContato(
            ${contato.id},
            '${contato.nome}',
            '${contato.telefone}',
            '${contato.email}'
          )">
            ✏
          </button>

          <button onclick="excluirContato(${contato.id})">
            🗑
          </button>

        </td>

      </tr>
    `;
  });
}

async function salvarContato(){

  const nome = document
    .getElementById("nome")
    .value
    .trim();

  const telefone = document
    .getElementById("telefone")
    .value
    .trim();

  const email = document
    .getElementById("email")
    .value
    .trim();

  if(nome === "" || telefone === "" || email === ""){

    alert("Preencha todos os campos");

    return;
  }

  let error = null;

  if(contatoEditando){

    const response = await client
      .from("contato")
      .update({
        nome,
        telefone,
        email
      })
      .eq("id", contatoEditando);

    error = response.error;

  }else{

    const response = await client
      .from("contato")
      .insert([
        {
          nome,
          telefone,
          email
        }
      ]);

    error = response.error;
  }

  if(error){

    console.log(error);

    alert("Erro ao salvar contato");

    return;
  }

  limparFormulario();

  listarContatos();
}

function editarContato(id, nome, telefone, email){

  contatoEditando = id;

  document.getElementById("nome").value = nome;

  document.getElementById("telefone").value = telefone;

  document.getElementById("email").value = email;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function excluirContato(id){

  const confirmar = confirm(
    "Deseja realmente excluir este contato?"
  );

  if(!confirmar){
    return;
  }

  const { error } = await client
    .from("contato")
    .delete()
    .eq("id", id);

  if(error){

    console.log(error);

    alert("Erro ao excluir contato");

    return;
  }

  listarContatos();
}

function limparFormulario(){

  contatoEditando = null;

  document.getElementById("nome").value = "";

  document.getElementById("telefone").value = "";

  document.getElementById("email").value = "";
}

listarContatos();
