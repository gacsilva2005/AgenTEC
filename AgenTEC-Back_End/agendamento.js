class Agendamento {
    //Métodos Privados
    #dia;
    #laboratorio;
    #horario;
    #periodo;

    //Construtor da classe
    constructor(dia, laboratorio, horario, periodo) {
        this.#dia = dia;
        this.#laboratorio = laboratorio;
        this.#horario = horario;
        this.#periodo = periodo;
    }

    //Métodos getter e setter da classe
    getListaltens() {

    }
    
    setListaltens() {

    }

    getDia() {
        return this.#dia;
    }

    getLaboratorio() {
        return this.#laboratorio;
    }
}