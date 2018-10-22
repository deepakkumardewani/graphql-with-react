const graphql = require('graphql')
const axios = require('axios')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      async resolve (parentValue, args) {
        const result = await axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
        return result.data
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve (parentValue, args) {
        const result = await axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        return result.data
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve (parentValue, args) {
        const result = await axios.get(`http://localhost:3000/users/${args.id}`)
        return result.data
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve (parentValue, args) {
        const result = await axios.get(`http://localhost:3000/companies/${args.id}`)
        return result.data
      }
    }
  }
})


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        companyId: { type: GraphQLString },
        firstName: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      async resolve(parentValue, { firstName, age }) {
        const result = await axios.post('http://localhost:3000/users', { firstName, age })
        return result.data
      }
    }
  }

})
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
