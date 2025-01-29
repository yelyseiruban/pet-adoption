
export const typeDefs = `#graphql
  scalar Date

  type Pet {
    id: ID!
    name: String!
    race: String
    age: Int!
    adopted: Boolean! 
  }

  type User {
    id: ID!
    name: String!
    canAdopt: Boolean!
    pets: [Pet]
  }

  type Adoption {
    id: ID!
    userId: ID!
    petId: ID!
    dateTime: Date!
  }

  input PetInput {
    name: String!
    race: String
    age: Int!
  }

  input UserInput {
    name: String!
  }

  input AdoptionInput {
    userId: ID!
    petId: ID!
  }

   # Filters
  input PetFilter {
    name: StringFilter
    race: StringFilter
    age: IntFilter
  }

  input StringFilter {
    eq: String
    ne: String
    contains: String
    notContains: String
  }

  input IntFilter {
    eq: Int
    ne: Int
    gt: Int
    gte: Int
    lt: Int
    lte: Int
  }

  input PaginationInput {
    limit: Int
    offset: Int
  }

  type Query {
    pets(filter: PetFilter, sort: String, pagination: PaginationInput): [Pet]
    pet(id: ID!): Pet
    users: [User]
    user(id: ID!): User
    adoptions: [Adoption]
    adoption(id: ID!): Adoption
  }

  type Mutation {
    createPet(input: PetInput): Pet
    createUser(input: UserInput): User
    createAdoption(input: AdoptionInput): Adoption
  }
`;
