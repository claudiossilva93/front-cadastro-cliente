import { http } from './config';


export default {

  listar : ( client_id ) =>{

    return http.get(`dependentes/dependentesByCliente/${ client_id }`)

  },

  salvar: ( dependente ) =>{

    return http.post('dependentes', dependente)

  },

  atualizar: ( dependente ) =>{

    return http.put(`dependentes/${ dependente.id }`, dependente)

  },

  deletar: (dependente) =>{

    return http.delete(`dependentes/${ dependente.id }`)

  }


}