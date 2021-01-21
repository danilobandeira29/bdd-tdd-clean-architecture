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

# TDD
3 leis do TDD:
1. Você não pode escrever nenhum código de produção sem ter escrito um teste que detecte uma possível falha
2. Você não pode escrever mais testes de unidade do que o suficiente para detectar a falha
3. Você não pode escrever mais código do que o suficiente para passar nos testes

Resumindo:
- Irei criar o teste e ele irá falhar
- Depois irei começar a criar a funcionalidade
- Refatorar o código

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
- Criar o primeiro teste
```typescript
describe('Local save purchase', () => {
  test('', () => {
    expect(1).toBe(1)
  })
})
```
- Criar um script de test
```json
"scripts": {
  "test": "jest --no-cache --watchAll"
}
```

## Criando primeiro teste
- Devo entender que nos requisitos existe comportamentos misturados: regras de negócio(deletar caches de 3 dias atras) e regras genéricas(delete, save, load)
- Ou seja, com regras genéricas eu devo utilizar um helper ou repository para auxiliar o service para que ele ocorra da maneira correta. 

```typescript
class LocalSavePurchase {

  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}

  execute = async () => {
    this.cacheRepository.delete('purchaseKey')
  }

}

interface CacheRepositoryInterface {
  delete: (key: string) => void
}


class FakeCacheRepository implements CacheRepositoryInterface {
  deleteCallsCount = 0
  key = ''

  delete = (key: string): void => {
    this.deleteCallsCount++
    this.key = key
  }

}

let fakeCacheRepository: FakeCacheRepository
let localSavePurchase: LocalSavePurchase

describe('LocalSavePurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    localSavePurchase = new LocalSavePurchase(fakeCacheRepository)
    
  })

  test('should not delete cache on init', () => {
    expect(fakeCacheRepository.deleteCallsCount).toBe(0)
  })

  test('should delete old cache when a new cache is saved', async () => {
    await localSavePurchase.execute()
    
    expect(fakeCacheRepository.deleteCallsCount).toBe(1)
  })

  test('should call delete with correct key', async () => {
    await localSavePurchase.execute()
    
    expect(fakeCacheRepository.key).toBe('purchaseKey')
  })
  // posso reduzir os dois testes acima para apenas um
  // se executar uma função assíncrona sem o await ele retorna uma promise
})

```

- Com o teste `should call delete with correct key` eu posso retirar o teste `should delete old cache when a new cache is saved`? **NÃO!!**, pois eu posso ter em produção a chamada do método delete acontecendo 2 vezes, ou seja, não é um comportamento correto, por isso a contagem da quantidade de vezes que o método delete foi chamado é importante

## Services e Testes
- O `LocalSavePurchase` é apenas um service fake que implementa a use-case do Domain `SavePurchase`
- **Não** posso tipar o *value* recebido no `CacheRepositoryInterface`, pois ele é um componente genérico e não deve servir a apenas um use case/service, já que ele pode ser utilizado em mais de um
- Caso eu não espere uma função assíncrona executar, ela irá me retornar uma `Promise`, mesmo sendo `void`
```js
async function testFunction() {
  return 'Hello, world'
}

const result = await testFunction() // retorna 'Hello, world'
const promise = testFunction() // Promise {<fulfilled>: "Hello, world!"}
```
