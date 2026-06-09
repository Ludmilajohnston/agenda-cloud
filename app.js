const SUPABASE_URL = "https://kkbnekygfwizviapvcfo.supabase.co";
const SUPABASE_KEY = "sb_publishable_3Fi7MWfPTdKXOVAF_AxkGw_1QT4xTKm";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let contatoEditando = null;

async function listarContatos() {
try {
const { data, error } = await client
.from("contato")
.select("*")
.order("id", { ascending: true });

```
if (error) throw error;

const lista = document.getElementById("listaContatos");

lista.innerHTML = data.map(contato => `
  <tr>
    <td>${contato.nome}</td>
    <td>${contato.telefone}</td>
    <td>${contato.email}</td>

    <td>
      <button onclick='editarContato(
        ${contato.id},
        ${JSON.stringify(contato.nome)},
        ${JSON.stringify(contato.telefone)},
        ${JSON.stringify(contato.email)}
      )'>✏️</button>

      <button onclick="excluirContato(${contato.id})">🗑️</button>
    </td>
  </tr>
`).join("");
```

} catch (err) {
console.error(err);
alert("Erro ao carregar contatos.");
}
}

async function salvarContato() {
const nome = document.getElementById("nome").value.trim();
const telefone = document.getElementById("telefone").value.trim();
const email = document.getElementById("email").value.trim();

if (!nome || !telefone || !email) {
alert("Preencha todos os campos.");
return;
}

const emailValido = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

if (!emailValido.test(email)) {
alert("E-mail inválido.");
return;
}

try {
let response;

```
if (contatoEditando) {
  response = await client
    .from("contato")
    .update({ nome, telefone, email })
    .eq("id", contatoEditando);
} else {
  response = await client
    .from("contato")
    .insert([{ nome, telefone, email }]);
}

if (response.error) throw response.error;

limparFormulario();
await listarContatos();

alert(contatoEditando ? "Contato atualizado!" : "Contato salvo!");
```

} catch (err) {
console.error(err);
alert("Erro ao salvar contato.");
}
}

function editarContato(id, nome, telefone, email) {
contatoEditando = id;

document.getElementById("nome").value = nome;
document.getElementById("telefone").value = telefone;
document.getElementById("email").value = email;

const btn = document.getElementById("btnSalvar");
if (btn) btn.textContent = "Atualizar";

window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirContato(id) {
const confirmar = confirm("Deseja realmente excluir este contato?");
if (!confirmar) return;

try {
const { error } = await client
.from("contato")
.delete()
.eq("id", id);

```
if (error) throw error;

await listarContatos();
```

} catch (err) {
console.error(err);
alert("Erro ao excluir contato.");
}
}

function limparFormulario() {
contatoEditando = null;

document.getElementById("nome").value = "";
document.getElementById("telefone").value = "";
document.getElementById("email").value = "";

const btn = document.getElementById("btnSalvar");
if (btn) btn.textContent = "Salvar";
}

listarContatos();
