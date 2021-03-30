<template>
  <div id="app">

    <nav>
      <div class="nav-wrapper blue darken-1">
        <a href="#" class="brand-logo center">Clientes Tryio Front</a>
      </div>
    </nav>

    <div class="container">

      <form @submit.prevent="salvar">

          <label>Código</label>
          <input type="text" placeholder="Código" v-model="cliente.codigo">
          <label>Nome</label>
          <input type="text" placeholder="Nome" v-model="cliente.nome">
          <label>Endereço</label>
          <input type="text" placeholder="Endereço" v-model="cliente.endereco">
          <label>Telefone</label>
          <input type="text" placeholder="Telefone" v-mask="['(##) ####-####', '(##) #####-####']" v-model="cliente.telefone">
          <button class="waves-effect waves-light btn-small">Salvar<i class="material-icons left">save</i></button>

      </form>

      <table>

        <thead>

          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>OPÇÕES</th>
          </tr>

        </thead>

        <tbody>

          <tr v-for="cliente of clientes" :key="cliente.id">

            <td>{{ cliente.codigo }}</td>
            <td>{{ cliente.nome }}</td>
            <td>{{ cliente.endereco }}</td>
            <td>{{ cliente.telefone }}</td>
            <td>
              <button @click="atualizar(cliente)" class="waves-effect btn-small blue darken-1"><i class="material-icons">create</i></button>
              <button @click="exibirDependentes(cliente)" class="waves-effect btn-small green darken-1"><i class="material-icons">people</i></button>
              <button @click="deletar(cliente)" class="waves-effect btn-small red darken-1"><i class="material-icons">delete_sweep</i></button>
            </td>

          </tr>

        </tbody>
      
      </table>

    </div>

  </div>

  <div id="modal1" class="modal">
    <div class="modal-content">
      <h4>Dependentes</h4>
    </div>
    
    <div class="container">
      <form @submit.prevent="salvarDependente">

          <label>Nome</label>
          <input type="text" placeholder="Nome" v-model="dependente.nome">
          <label>Idade</label>
          <input type="number" placeholder="Idade" v-model="dependente.idade">
          <select v-model="dependente.tipo" >
              <option value="" >Selecione o parentesco</option>
              <option value="Filha(o)" >Filha(o)</option>
              <option value="Esposa(o)" selected>Esposa(o)</option>
            </select>
            <label>Selecione o parentesco</label>
          <button class="waves-effect waves-light btn-small">Salvar<i class="material-icons left">save</i></button>

      </form>

      <table>

        <thead>

          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Parentesco</th>
            <th>Opções</th>
          </tr>

        </thead>

        <tbody>

          <tr v-for="dependente of dependentes" :key="dependente.id">

            <td>{{ dependente.nome }}</td>
            <td>{{ dependente.idade }}</td>
            <td>{{ dependente.tipo }}</td>
            <td>
              <button @click="atualizarDependente(dependente)" class="waves-effect btn-small blue darken-1"><i class="material-icons">create</i></button>
              <button @click="deletarDependente(dependente)" class="waves-effect btn-small red darken-1"><i class="material-icons">delete_sweep</i></button>
            </td>

          </tr>

        </tbody>
      
      </table>

    </div>
  </div>

</template>

<script>

  import {mask} from 'vue-the-mask'
  import Cliente from './services/Clientes'
  import Dependente from './services/Dependentes'
  import M from 'materialize-css'

  export default{

    data(){
      return{
        cliente:{
          id: '',
          codigo: '',
          nome: '',
          endereco: '',
          telefone: '',
          dependentes: []

        },

        dependente:{
          id: '',
          cliente_id: '',
          nome: '',
          idade: '',
          tipo: ''

        },

        clientes: [],
        dependentes: [],
        cliente_id: ''
      }
    },

    mounted(){

      var elems = document.querySelectorAll('select');
      M.FormSelect.init(elems, {});
      this.listar();

    },

    methods:{

      listar(){
        Cliente.listar().then(response => {
          this.clientes = response.data;
        });
      },

      salvar(){

        if(!this.cliente.id)
        {
          Cliente.salvar(this.cliente).then( () => {
            this.cliente = {};
            alert("Salvo com sucesso!")
            this.listar();

          } ).catch(e =>{

            console.log( e.response.data.message )

          });
        }else{

          Cliente.atualizar(this.cliente).then( () => {
            this.cliente = {};
            alert("Alterado com sucesso!")
            this.listar();

          } ).catch(e =>{

            console.log( e.response.data.message )

          });

        }
      },

      atualizar( cliente ){

        this.cliente = cliente;

      },

      deletar( cliente ){

        if(confirm("Deseja deletar o cliente!"))
        {
          Cliente.deletar(cliente).then( () => {
            this.cliente = {};
            alert("Deletado com sucesso!")
            this.listar();

          } ).catch(e =>{

            console.log( e.response.data.message )

          });
        }

      },

      exibirDependentes( cliente ){

        this.dependente = {};
        this.cliente_id  = cliente.id;

        this.listarDependentes();

        var elems = document.getElementById('modal1');
        M.Modal.init(elems, { 
          opacity: 0.5
        });
       
        var instance = M.Modal.getInstance(elems);
        instance.open();

      },

      listarDependentes(){
        Dependente.listar( this.cliente_id ).then(response => {
          this.dependentes = response.data;
        });
      },

      salvarDependente(){

        if(!this.dependente.id)
        {
        
        this.dependente.cliente_id = this.cliente_id;

          Dependente.salvar(this.dependente).then( () => {
            this.dependente = {};
            alert("Dependente salvo com sucesso!")
            this.listarDependentes();

          } ).catch(e =>{

            console.log( e.response.data.message )

          });
        }else{

          Dependente.atualizar(this.dependente).then( () => {
            this.dependente = {};
            alert("Dependente alterado com sucesso!")
            this.listarDependentes();

          } ).catch(e =>{

            console.log( e.response.data.message )

          });

        }
      },

      atualizarDependente( dependente ){

        this.dependente = dependente;

      },

      deletarDependente( dependente ){

        if(confirm("Deseja deletar o dependente?"))
        {
          Dependente.deletar(dependente).then( () => {
            this.cliente = {};
            alert("Deletado com sucesso!")
            this.listarDependentes();

          } ).catch(e =>{

            console.log( e.response.data.message )

          });
        }

      }

      

    },

    directives: {mask}



  }

</script>

<style>
</style>
