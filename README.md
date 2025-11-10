# 📌 AgenTEC - Gerenciamento e Agendamento de Laboratórios
---
<br>
<br>

<div align="center">    
<img src="https://i.postimg.cc/VLZXxfBG/etec.png" alt="Logo da ETEC" width="300"/>
<br> <br> <br> 
    
![Último Commit](https://img.shields.io/github/last-commit/gacsilva2005/AgenTEC?style=for-the-badge&label=ÚLTIMO%20COMMIT)
![Tamanho do Repositório](https://img.shields.io/github/repo-size/gacsilva2005/AgenTEC?style=for-the-badge&label=TAMANHO)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

[![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)](https://git-scm.com/)
[![MySQL](https://img.shields.io/badge/MYSQL-3972A0?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

O AgenTEC é um sistema de gerenciamento de laboratórios projetado para otimizar a reserva de espaços e a organização de materiais. A plataforma centraliza o processo, permitindo que usuários agendem horários nos laboratórios de forma eficiente e solicitem kits personalizados, que incluem vidrarias e reagentes necessários para seus experimentos. 
Esta aplicação vai além da simples exibição de formulários, funcionando como uma demonstração prática do domínio em desenvolvimento Front-End Clássico e da estruturação de um fluxo de trabalho complexo, essencial para a rotina de um laboratório químico/biológico.

---

<h2 align="center">🖥️ Como Executar o Projeto</h2>

---

<br>

<h3>⚙️ Pré-requisito Essencial</h3>

<p>
Antes de iniciar o sistema, é <strong>obrigatório importar o banco de dados</strong> no MySQL, pois ele contém todas as tabelas e logins necessários para o funcionamento do sistema.
</p>

<p>
O arquivo do banco está localizado em:
</p>

<pre><code>AgenTEC-DataBase-(SQL)/banco.sql</code></pre>

<p align="center">
  <a href="https://github.com/gacsilva2005/AgenTEC/raw/main/AgenTEC-DataBase-(SQL)/banco.sql"><strong>📥 Ou clique aqui para baixar o banco.sql</strong></a>
</p>


<br>

<h3>🧠 Como Importar o Banco de Dados</h3>

<ol>
  <li><strong>Abra o MySQL Workbench</strong><br>
  Certifique-se de que o servidor MySQL está em execução.</li>
  <br>
  
  <li><strong>Importe o script SQL:</strong><br>
  Vá em:<br>
  <code>File &gt; Open SQL Script...</code><br>
  e selecione o arquivo:<br>
  <code>AgenTEC-DataBase-(SQL)/banco.sql</code></li>
  <br>
  
  <li><strong>Execute o script:</strong><br>
  Clique no ícone ⚡ (Execute) para criar automaticamente o banco de dados <code>laboratorio_agendamentos</code> com todas as tabelas e dados.</li>
  <br>
  
  <li><strong>Confirme a criação:</strong><br>
  Atualize o painel “Schemas” e verifique se o banco <code>laboratorio_agendamentos</code> foi criado corretamente.</li>
</ol>

<br>

<blockquote>
💡 <strong>Dica via terminal:</strong><br>
<code>mysql -u root -p &lt; "AgenTEC-DataBase-(SQL)/banco.sql"</code>
</blockquote>

<br><br>

<h3>🔑 Logins Pré-definidos</h3>

<p>O sistema já possui <strong>três logins diferentes</strong> configurados no banco para testes iniciais:</p>
<br><br>
<table align="center">
  <tr>
    <th>Tipo de Usuário</th>
    <th>E-mail</th>
    <th>Senha</th>
  </tr>
  <tr>
    <td>👨‍💼 Administrador</td>
    <td><code>agentecadm@etec.com.br</code></td>
    <td><code>agentecadm123</code></td>
  </tr>
  <tr>
    <td>🧪 Técnico</td>
    <td><code>agentectecnico@etec.com.br</code></td>
    <td><code>agentectec123</code></td>
  </tr>
  <tr>
    <td>👩‍🏫 Professor</td>
    <td><code>agentecprofessor@etec.com.br</code></td>
    <td><code>agentecprofessor123</code></td>
  </tr>
</table>

<br><br>

<h3>💻 Execução do Front-End</h3>

<ol>
  <li><strong>Clone o repositório:</strong><br>
  <code>git clone https://github.com/gacsilva2005/AgenTEC.git</code></li>
  <br>
  
  <li><strong>Acesse o diretório:</strong><br>
  <code>cd AgenTEC-Front_End</code></li>
  <br>
  
  <li><strong>Abra o arquivo principal no navegador:</strong><br>
  Localize e abra:<br>
  <code>AgenTEC-Front_End/HTML/login.html</code></li>
</ol>

<blockquote>
💡 <strong>Dica:</strong> Use a extensão <strong>Live Server</strong> no VS Code para visualizar as alterações em tempo real.
</blockquote>
<br><br>
<blockquote>
<p align="center">
  💥 <strong>Extra:</strong> O projeto está em fase experimental, e futuramente todo o sistema oficial de banco de dados será diretamente integrado em um <strong>sistema de nuvem seguro</strong>.
</p>
</blockquote>

<br><br>
  
<hr> </hr>

## 🗒️ Features do projeto 🗒️
O AgenTEC foi desenvolvido para centralizar e otimizar a gestão de laboratórios, oferecendo as seguintes funcionalidades:

* **Gerenciamento de Agendamentos:** Sistema centralizado para visualização e reserva eficiente de horários em múltiplos laboratórios.
* **Controle de Recursos:** Organização detalhada de materiais, kits, vidrarias e reagentes disponíveis para experimentos.
* **Criação de Kits Personalizados:** Funcionalidade que permite aos usuários solicitarem conjuntos pré-definidos de materiais necessários para suas práticas.
* **Interface Intuitiva (Front-End Clássico):** Design focado na usabilidade, facilitando o fluxo de agendamento e requisição para qualquer usuário.
* **Estrutura de Workflow Complexa:** Demonstração prática da habilidade de modelar e implementar fluxos de trabalho complexos e específicos de um ambiente de laboratório.

<br>
<br>
<br>

<div align="center">   
<img src="" alt="Banner ETEC" width="600"/>
</div>


---

## 💎 Links Úteis

* [**Etec Irmã Agostina**](https://www.cps.sp.gov.br/etecs/etec-irma-agostina-capela-do-socorro/)
* [**Centro Paulo de Souza**](https://www.cps.sp.gov.br/)
* [**Banco de Dados Local**]<a href="https://github.com/gacsilva2005/AgenTEC/raw/main/AgenTEC-DataBase-(SQL)/banco.sql">
