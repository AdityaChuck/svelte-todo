<script>


  import moment, { duration } from "moment";

  //let's get the data, we will need getClient, query from svelte-apollo as well as gql from apollo-boost.

  import { getClient, query, mutate } from "svelte-apollo";
  import { gql } from "apollo-boost";

  import { fade,slide,scale,fly } from "svelte/transition"
  import { flip } from "svelte/animate"

  //I got this package for toast! hope this works!!
  import Toast from "svelte-toast"

  //components
  import AddTodo from "./AddTodo.svelte";
  import { onMount } from "svelte";

  //get the client
  const client = getClient();

  //instantiate toast
  const toast = new Toast()


  // query/ies
  const GET_TODOS = gql`
    {
      getTodos {
        id
        body
        createdAt
        done
      }
    }
  `;

  //Mutation/s
  const DELETE_TODO = gql`
    mutation($id: ID!) {
      deleteTodo(id: $id)
    }
  `;
  
  const DONE_TOGGLER = gql`
    mutation($id:ID!){
      doneToggler(id:$id)
    }
  `

  const todos = query(client, { query: GET_TODOS })

  onMount(() => {
    todos.refetch()
  })



  //---------------------------------------------------------------Delete-------------------------------------------------------------//
  const deleteItem = async (id) => {
    mutate(client, {
      mutation: DELETE_TODO,
      variables: { id },
    })
      .then((res) => {
        todos.refetch()
        toast.error(res.data.deleteTodo);
        
      })
      .catch((err) => console.log(err));
  };


 //----------------------------------------------------------------Done Toggler-----------------------------------------------------------//
  const doneToggler = (id) => {
    mutate(client, {
      mutation: DONE_TOGGLER,
      variables: { id }
    }).then(res => {
      let msg=''
      if(res.data.doneToggler === true){
        msg='Congrats!!'
      }
      else{
        msg='You can do it'
      }
      todos.refetch()
      toast.info(msg)
      
    })
  }


</script>

<style>
  .line-through {
    text-decoration: line-through;
  }
</style>

<!-- <AddTodo on:add={onAdd} /> -->



<AddTodo on:add = {() => todos.refetch()}/>



{#await $todos}
  <div class="d-flex justify-content-center mt-5">
    <div class="spinner-grow text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-secondary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-danger" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-warning" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-info" role="status">
      <span class="sr-only">Loading...</span>
    </div>    
    <div class="spinner-grow text-dark" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
{:then res}
  <div class="col-12 col-md-10 col-lg-7 mt-4">
    <div class="list-group list-group-flush">
      {#each res.data.getTodos as item, index (item.id)}
        <div class="list-group-item d-flex align-items-start" in:fly={{x:200, duration:500}} out:fade|local={{duration:500}} animate:flip={{duration:500}}>
          <button
            class="mr-2 btn btn-sm btn-danger"
            on:click={() => deleteItem(item.id)}>
            <i class="fa fa-trash" aria-hidden="true" />
          </button>

          <a href="/{item.id}" class="mr-2 btn btn-sm btn-info">
            <i class="fa fa-pencil" style="color:white"/>
          </a>

          <button
            class={item.done ? 'mr-2 btn btn-sm btn-dark' : 'mr-2 btn btn-sm btn-outline-dark'}
            on:click={() => {
              doneToggler(item.id);
            }}>
            <i
              class={item.done ? 'fa fa-check-square-o' : 'fa fa-square-o'}
              aria-hidden="true" />
          </button>

          <div class="w-100">
            <div class="d-flex justify-content-between">
              <span
                class={item.done ? 'h4 text-dark line-through' : 'h4 text-dark'}>{item.body}</span>
              <span
                class="float-right text-info">{item.done ? 'Done' : moment(item.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  {:catch err}
    <div class="text-center mt-5">
      <h4 class="text-danger">{err}</h4>
    </div>
{/await}

  

