import nodemailer from "nodemailer";

class Sistema {
    codigoRecuperacao; // pública
    #usuarioLogado;    // privada
    emailRecuperacao;

    constructor() {
        this.codigoRecuperacao = 0;
        this.#usuarioLogado = 0;
        this.emailRecuperacao = "";
    }

    // Gera um código aleatório de 6 dígitos
    gerarCodigoEmail() {
        this.codigoRecuperacao = Math.floor(100000 + Math.random() * 900000);
        return this.codigoRecuperacao;
    }

    // Envia o e-mail com o código
    async enviarEmail() {
        if (!this.emailRecuperacao || !this.codigoRecuperacao) {
            throw new Error("Email ou código não definido");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.seuprovedor.com", // ex: smtp.gmail.com
            port: 587,
            secure: false, // true se usar SSL
            auth: {
                user: "seuemail@dominio.com",
                pass: "suasenha",
            },
        });

        return await transporter.sendMail({
            from: '"Recuperação de Senha" <seuemail@dominio.com>',
            to: this.emailRecuperacao,
            subject: "Código de Recuperação",
            text: `Seu código de recuperação é: ${this.codigoRecuperacao}`,
            html: `<p>Seu código de recuperação é: <b>${this.codigoRecuperacao}</b></p>`,
        });
    }

    // Gera o código e envia para o e-mail informado
    async gerarEEnviarCodigo(email) {
        this.setEmailRecuperacao(email);
        this.gerarCodigoEmail();
        return await this.enviarEmail();
    }


    // Getters e Setters
    getEmailRecuperacao() {
        return this.emailRecuperacao;
    }

    setEmailRecuperacao(email) {
        this.emailRecuperacao = email;
    }

    getUsuarioLogado() {
        return this.#usuarioLogado;
    }

    setUsuarioLogado(idUsuario) {
        this.#usuarioLogado = idUsuario;
    }

}

export default Sistema;
