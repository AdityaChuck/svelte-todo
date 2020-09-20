<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();


  import { getClient, mutate } from "svelte-apollo";
  import { gql } from "apollo-boost";
  
  import moment from "moment";

  //I got this package for toast! hope this works!!
  import Toast from "svelte-toast"

  import { fade,slide,scale,fly } from "svelte/transition"
  import { flip } from "svelte/animate"

  //instantiate toast
  const toast = new Toast()

  //get the client
  const client = getClient();


   //Mutation/s
   const CREATE_TODO = gql`
    mutation($body: String!) {
      createTodo(body: $body) {
        createdAt
      }
    }
  `;

  let body = "";
  let hidepanel = false;


  const onAdd = async () => {
    mutate(client, {
      mutation: CREATE_TODO,
      variables: { body },
    })
      .then((res) => {
        let msg = moment(res.data.createTodo.createdAt).format(
          "MM-DD-YY, h:mm a"
        );
        toast.success(`Added on ${msg}`);
        body = "";
        hidepanel = true;
        dispatch('add')
      })
      .catch((err) => console.log(err));
  }


</script>



<div class="col-12">
  <div class="card textcenter mt-3">
    <div
      class="card-header bg-primary text-white cursor"
      on:click={() => (hidepanel = !hidepanel)}>
      <i class="fa fa-plus mr-3"/> WHAT NEEDS TO BE DONE?
    </div>
    {#if hidepanel}
    <div class="card-body" in:slide={{x:200, duration:500}} out:slide={{x:-200, duration:500}}>
      <form on:submit|preventDefault={onAdd}>
        <div class="form-group form-row">
          <label
            class="col-md-2 col-form-label text-md-right"
            for="todo_body">What's next?</label>
          <div class="col-md-10">
            <input
              type="text"
              class="form-control"
              id="todo_body"
              placeholder="Type here"
              bind:value={body} />
          </div>
        </div>
        <div class="form-group form-row mb-0">
          <div class="offset-md-2 col-md-10">
            <button disabled={body.length===0} type="submit" class="btn btn-primary d-block ml-auto">
              Add to the list
            </button>
          </div>
        </div>
      </form>
    </div>
    {/if}
  </div>
</div>

<style>
  .cursor{
    cursor: pointer;
  }
</style>

