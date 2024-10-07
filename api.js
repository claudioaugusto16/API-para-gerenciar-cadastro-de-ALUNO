const express = require('express');
const app = express();

app.use(express.json());

let alunos = [];


function calcularSituacao(aluno) {
    aluno.media = (aluno.primeiraNota + aluno.segundaNota) / 2;
    if (aluno.media >= 7) {
        aluno.situacao = "aprovado";
    } else if (aluno.media >= 4) {
        aluno.situacao = "recuperação";
    } else {
        aluno.situacao = "reprovado";
    }
}


function validarNotas(nota) {
    return nota >= 0 && nota <= 10;
}


app.post('/alunos', (req, res) => {
    const { nome, primeiraNota, segundaNota } = req.body;

    if (!validarNotas(primeiraNota) || !validarNotas(segundaNota)) {
        return res.status(400).json({ erro: "Informe uma nota válida" });
    }

    const id = alunos.length + 1;
    const aluno = { id, nome, primeiraNota, segundaNota };
    calcularSituacao(aluno);
    alunos.push(aluno);
    res.status(201).json(aluno);
});


app.get('/alunos', (req, res) => {
    res.json("TA RODANDO");
});


app.put('/alunos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, primeiraNota, segundaNota } = req.body;

    const aluno = alunos.find(a => a.id == id);
    if (!aluno) {
        return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    if (!validarNotas(primeiraNota) || !validarNotas(segundaNota)) {
        return res.status(400).json({ erro: "Informe uma nota válida" });
    }

    aluno.nome = nome;
    aluno.primeiraNota = primeiraNota;
    aluno.segundaNota = segundaNota;
    calcularSituacao(aluno);

    res.json(aluno);
});


app.delete('/alunos/:id', (req, res) => {
    const { id } = req.params;

    const index = alunos.findIndex(a => a.id == id);
    if (index === -1) {
        return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    alunos.splice(index, 1);
    res.status(204).send();
});


app.get('/alunos/:id', (req, res) => {
    const { id } = req.params;
    const aluno = alunos.find(a => a.id == id);
    if (!aluno) {
        return res.status(404).json({ erro: "Aluno não encontrado" });
    }
    res.json({ nome: aluno.nome, media: aluno.media });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
