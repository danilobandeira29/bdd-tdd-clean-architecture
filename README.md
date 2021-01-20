# BDD - Behavior Driven Development

- Converso com meu cliente(pessoa que vai utilizar meu sistema) e escuto dela qual a versão dela do sistema
- Conversa com o cliente para entender o pontos de vista dele
- Anotar as opiniões dele e depois passar para um documento, onde irá descrever a narrativa e cenário
- Fazer uso da `narrativa` e depois escreve os `cenários` baseados em cada narrativa

BDD é(given, when, then...):
1. Dado que algo aconteceu(cláusulas)
2. E quando acontecer alguma coisa
3. Então...

Esse projeto independe de framework, então a ideia é aprender sobre boas práticas(clea architecture, tdd, bdd) para que seja uma aplicação escalável e de fácil manutenção, podendo também portar coisas para outras aplicações.

## Configurando o projeto
- Não devo começar instalando várias dependências ou criar um monte de páginas se eu não irei utilizar imediatamente, **YAGN - You ain't gonna need it**.
- Iniciar o npm e instalar o typescript, logo em seguida utilizar o tsc --init para iniciar as configurações do typescript
```bash
npm install -D typescript @types/node
```
- Habilitar *baseUrl*, *rootDir* e *paths*
- Sendo o *paths*
```json
"paths": {
  "@/*": ["*"]
}
```
- Instalar o jest
```bash
npm install -D jest @types/jest ts-jest
```
> ts-jest converte o código de typescript para javascript
- Criar na raíz o `jest.config.js`
```js
module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.*\\.ts$': 'ts-jest' // utilizar o ts-jest para converser o codigo typescript
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1' //(.*) captura esse valor e colocar no $1
  }
}
```

## Iniciando o projeto
- Criar pasta src/domain/use-cases
- Nessa pasta não irá implementação de nada, vai apenas **interfaces e modelos(entities)**
- Criar a interface use case para salvar em cache
