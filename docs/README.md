# Exemplos de JSON para Criação de Entidades

Este diretório contém exemplos de JSON válidos para criar entidades no sistema ServiceHub.

##  Entidades Disponíveis

### 1. **Cliente (Client)**
- **Arquivo**: `create-client.json`
- **Endpoint**: `POST /api/v1/clients`
- **Campos obrigatórios**:
  - `id`: UUID do usuário associado
  - `name`: Nome completo do cliente

### 2. **Provedor (Provider)**
- **Arquivo**: `create-provider.json`
- **Endpoint**: `POST /api/v1/providers`
- **Campos obrigatórios**:
  - `id`: UUID do usuário associado
  - `name`: Nome da empresa/prestador
  - `prof_description`: Descrição profissional detalhada

### 3. **Usuário (User)**
- **Arquivo**: `create-user.json`
- **Endpoint**: `POST /api/v1/users`
- **Campos obrigatórios**:
  - `email`: Email válido
  - `hashSenha`: Senha já hasheada (bcrypt)
- **Campos opcionais**:
  - `ativo`: Status do usuário (padrão: true)

### 4. **Provisão de Serviço (ServiceProvision)**
- **Arquivo**: `create-service-provision.json`
- **Endpoint**: `POST /api/v1/service-provisions`
- **Campos obrigatórios**:
  - `title`: Título do serviço (3-100 caracteres)
  - `description`: Descrição detalhada (mínimo 10 caracteres)
  - `price`: Preço positivo (maior que zero)
  - `providerId`: UUID do provedor
- **Campos opcionais**:
  - `status`: Status do serviço (padrão: "active")

### 5. **Pedido de Serviço (ServiceRequest)**
- **Arquivo**: `create-service-request.json`
- **Endpoint**: `POST /api/v1/service-requests`
- **Campos obrigatórios**:
  - `clientId`: UUID do cliente
  - `serviceId`: UUID do serviço provisionado
  - `providerId`: UUID do provedor
  - `chargedAmount`: Valor cobrado (positivo)

##  Ordem de Criação Recomendada

Para criar entidades relacionadas corretamente, siga esta ordem:

1. **Usuário** → `create-user.json`
2. **Cliente/Provedor** → `create-client.json` ou `create-provider.json` (usando o ID do usuário criado)
3. **Provisão de Serviço** → `create-service-provision.json` (usando o ID do provedor)
4. **Pedido de Serviço** → `create-service-request.json` (usando IDs de cliente, serviço e provedor)

##  Regras de Negócio Importantes

- **Preços**: Devem ser maiores que zero
- **Serviços**: Só podem ser contratados se estiverem com status "active"
- **Exclusão**: Serviços com pedidos vinculados são inativados, não excluídos fisicamente
- **Provedores**: Devem ser criados após o usuário base

##  Como Usar

```bash
# Exemplo de uso com curl
curl -X POST http://localhost:3000/api/v1/clients \
  -H "Content-Type: application/json" \
  -d @examples/create-client.json
```