# Testes gerais — Apex

Este repositório concentra regras de negócio pequenas e isoladas que podem ser
executadas sem o ambiente completo do produto.

## Cenários publicados

- normalização e validação de e-mail;
- política forte para profissionais;
- senha provisória simples para alunos criados pelo coach;
- geração de senha forte;
- mensagens de erro de autenticação sem detalhes técnicos.

## Execução

```bash
npm install
npm test
```

Os dados são sintéticos. O teste de integração da função que cria alunos
continua no projeto privado; aqui fica a regra de negócio e sua evidência de
forma independente.
