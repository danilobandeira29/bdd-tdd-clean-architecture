# BDD - Behavior Driven Development
### Fazer com que um time desenvolva software, falando uma mesma língua, entregando valor pro cliente, fazendo uso de cenários e como consequência automatizando os testes.

- **É sobre criar software através da descrição do seu comportamento sob a perspectiva das partes interessadas. Ou seja, o Cliente é essencial para ele, pois é com base na perspectiva dele.**
- **Todos devem falar uma mesma língua. O problema de requisitos é um problema de comunicação.**
- **É mais do que automação de testes. Isso é consequência.**
- Deve envolver todo o time, não é só criar cenários.
- Ajuda a criar software que realmente irá ajudar o cliente resolver o problema.
- Converso com meu cliente(pessoa que vai utilizar meu sistema) e escuto dela qual a versão dela do sistema, para entender o pontos de vista dele.
- Anotar as opiniões dele e depois passar para um documento, onde irá descrever as narrativas e cenários.
- Fazer uso da `narrativa` e depois escreve os `cenários` baseados em cada narrativa.
<p align="center">
  <img src="https://ik.imagekit.io/xfddek6eqk/user_story_sChKwRSFP.png" alt="funcionalidades"/>
</p>


### 3 Princípios do BDD
1. O suficiente é o suficiente(só é criado e automatizado o que gerar valor para o usuário)
2. Entregar valor para as partes interessadas(escrever os cenários a partir da perspectiva do usuário e não do testador ou analista de negócios)
3. Tudo é comportamento

**BDD é foco no negócio**

**TDD é foco no código**

**Software é a materialização do conhecimento que os desenvolvedores sobre o negócio**

**BDD é(given, when, then...):**
1. Dado que algo aconteceu(cláusulas)
2. E quando acontecer alguma coisa
3. Então...

## Problemas que o BDD resolve
1. As pessoas enxergam claramente o que será construído
2. O time de desenvolvimento entendem realmente as necessidades do negócio que devem ser atendidas
3. As pessoas do negócio entendem os desafios técnicos na implementação dos requisitos levantados
4. Gera uma documentação que fica sempre atualizada(evita o: tem que descobrir como isso funciona? vai pro código e vê)

## Elementos chaves do BDD
Meta de negócio(força que direciona o projeto): 
- Não é chegar e perguntar para o cliente o que ele quer, pois ele raramente sabe o que quer
- O cliente tem dores, ele sabe o que incomoda ele
- Muitas funcionalidades NÃO é sinônimo de alto valor entregue
<p align="center">
  <img src="https://ik.imagekit.io/xfddek6eqk/funcionalidades_J5tNXsNN5.png" alt="funcionalidades"/>
</p>

Mapas de Impacto:
- Para explorar hipóteses utilizamos *mapas de impacto* que nos ajudam a visualmente identificar o **porquê**, **quem**, **como** e **quais problemas** estamos enfrentando.

# BDD & TDD
Descrevemos o comportamento do sistema com *cenários* e *critérios de aceite*, mas quando vamos implementar seus detalhes e testar o como ele implementa essa funcionalidade, usamos o **TDD**.

Esse projeto independe de framework, então a ideia é aprender sobre boas práticas(clea architecture, tdd, bdd) para que seja uma aplicação escalável e de fácil manutenção, podendo também portar coisas para outras aplicações.

# TDD
3 leis do TDD:
1. Você não pode escrever nenhum código de produção sem ter escrito um teste que detecte uma possível falha
2. Você não pode escrever mais testes de unidade do que o suficiente para detectar a falha
3. Você não pode escrever mais código do que o suficiente para passar nos testes

Resumindo(red, green, refactor):
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
- Caso eu não espere uma função assíncrona executar, ela irá me retornar uma `Promise`, mesmo sendo `void`. Então eu consigo observar se ela irá ser chamada pelo *resolve* ou *reject*.

```js
async function testFunction() {
  return 'Hello, world'
}

const result = await testFunction() // retorna 'Hello, world'
const promise = testFunction() // Promise {<fulfilled>: "Hello, world!"}
```
- Utilizei o `namespace` para criar uma variável/estrutura interna em uma interface(similar a criação de um atributo abstrato em Java) para criar um array enum que irá observar a ordem das contagens dos métodos delete e save, para saber se o delete é chamado antes do save.
- Posso abstrair e criar um novo método no `CacheRepositoryInterface` que será o replace, que nada mais é do que a chamada dos métodos `delete` e `save`.
- Evitar utilizar currying, pois achei bastante confuso quando utilizado em projetos grandes

### Helpers
- Foi criado uma class CachePolicy, onde não será possível instancia-la mas apenas utilizar o método validate, que servirá pra validar o cache de acordo com duas datas passadas(timestamp e a data atual).
- Também foi criado outro helper para os testes, que irá retornar uma data.

Mas por que não utilizar o CachePolicy e o getCacheExpirationDate tanto em teste como em produção?

Se eu alterar a politica de Cache, eu devo alterar primeiro no teste e depois alterar no de produção. Eles devem ser separados
