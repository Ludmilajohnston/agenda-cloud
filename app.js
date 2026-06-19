const SUPABASE_URL = "https://kkbnekygfwizviapvcfo.supabase.co";
const SUPABASE_KEY = "sb_publishable_3Fi7MWfPTdKXOVAF_AxkGw_1QT4xTKm";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let contatoEditando = null;
let usuarioAtual = null;
let termoBusca = "";


async function verificarAutenticacao() {
    const { data: { user }, error } = await client.auth.getUser();
    
    if (error || !user) {
        const { data, error: signInError } = await client.auth.signInAnonymously();
        if (signInError) {
            console.error("Erro de autenticação:", signInError);
            alert("❌ Erro ao conectar. Recarregue a página.");
            return false;
        }
        usuarioAtual = data.user;
    } else {
        usuarioAtual = user;
    }
    
    const userTag = document.getElementById("usuarioLogado");
    if (userTag) {
        userTag.textContent = `👤 ${usuarioAtual.email || 'Convidado'}`;
    }
    
    return true;
}


async function buscarContatos() {
    termoBusca = document.getElementById("buscaNome").value.trim();
    await listarContatos();
}


async function listarContatos() {
    if (!usuarioAtual) {
        const autenticado = await verificarAutenticacao();
        if (!autenticado) return;
    }

    try {
        let query = client
            .from("contato")
            .select("*")
            .eq("user_id", usuarioAtual.id)
            .order("id", { ascending: true });

        if (termoBusca) {
            query = query.ilike("nome", `%${termoBusca}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        const lista = document.getElementById("listaContatos");
        lista.innerHTML = "";

        const contador = document.getElementById("contadorContatos");
        if (contador) {
            contador.textContent = `${data.length} contato${data.length !== 1 ? 's' : ''}`;
        }

        if (data.length === 0) {
            lista.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <span class="empty-icon">📭</span>
                        <span>${termoBusca ? 'Nenhum contato encontrado para "' + termoBusca + '"' : 'Nenhum contato cadastrado'}</span>
                        <small>${termoBusca ? 'Tente outra busca' : 'Adicione seu primeiro contato!'}</small>
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach((contato) => {
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
                <td>${contato.id}</td>
                <td>${contato.nome}</td>
                <td>${contato.telefone}</td>
                <td>${contato.email}</td>
                <td>
                    <button class="editar" data-id="${contato.id}">✏️</button>
                    <button class="excluir" data-id="${contato.id}">🗑️</button>
                </td>
            `;

            tr.querySelector(".editar").addEventListener("click", () => {
                editarContato(contato.id, contato.nome, contato.telefone, contato.email);
            });

            tr.querySelector(".excluir").addEventListener("click", () => {
                excluirContato(contato.id);
            });

            lista.appendChild(tr);
        });

    } catch (err) {
        console.error("Erro ao listar contatos:", err);
        alert("❌ Erro ao carregar contatos.");
    }
}


async function salvarContato() {
    if (!usuarioAtual) {
        const autenticado = await verificarAutenticacao();
        if (!autenticado) return;
    }

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !telefone || !email) {
        alert("❌ Preencha todos os campos.");
        return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
        alert("❌ E-mail inválido.");
        return;
    }

    try {
        const btn = document.getElementById("btnSalvar");
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
                .eq("id", contatoEditando)
                .eq("user_id", usuarioAtual.id);
        } else {
            response = await client
                .from("contato")
                .insert([{
                    nome,
                    telefone,
                    email,
                    obs: null,
                    dtcontato: null,
                    user_id: usuarioAtual.id
                }]);
        }

        if (response.error) throw response.error;

        const mensagem = contatoEditando !== null ? "✅ Contato atualizado!" : "✅ Contato salvo!";
        limparFormulario();
        await listarContatos();
        alert(mensagem);

    } catch (err) {
        console.error("Erro ao salvar:", err);
        alert("❌ Erro ao salvar contato.");
    } finally {
        const btn = document.getElementById("btnSalvar");
        btn.disabled = false;
        btn.textContent = contatoEditando !== null ? "Atualizar" : "Salvar";
    }
}


function editarContato(id, nome, telefone, email) {
    contatoEditando = id;
    document.getElementById("nome").value = nome;
    document.getElementById("telefone").value = telefone;
    document.getElementById("email").value = email;
    document.getElementById("btnSalvar").textContent = "Atualizar";
    document.getElementById("formTitle").textContent = "✏️ Editar Contato";
    window.scrollTo({ top: 0, behavior: "smooth" });
}


async function excluirContato(id) {
    if (!confirm("⚠️ Deseja realmente excluir este contato?")) return;

    if (!usuarioAtual) {
        const autenticado = await verificarAutenticacao();
        if (!autenticado) return;
    }

    try {
        const { error } = await client
            .from("contato")
            .delete()
            .eq("id", id)
            .eq("user_id", usuarioAtual.id);

        if (error) throw error;

        await listarContatos();
        alert("✅ Contato excluído!");

    } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("❌ Erro ao excluir contato.");
    }
}


function limparFormulario() {
    contatoEditando = null;
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("btnSalvar").textContent = "Salvar";
    document.getElementById("formTitle").textContent = "📝 Novo Contato";
}


function novoContato() {
    limparFormulario();
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("nome").focus();
}


function limparBusca() {
    document.getElementById("buscaNome").value = "";
    termoBusca = "";
    listarContatos();
}


document.addEventListener("DOMContentLoaded", async () => {
    await verificarAutenticacao();
    await listarContatos();
});


window.salvarContato = salvarContato;
window.limparFormulario = limparFormulario;
window.novoContato = novoContato;
window.buscarContatos = buscarContatos;
window.limparBusca = limparBusca;
