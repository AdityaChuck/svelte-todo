<script>
  import page from "page";

  import { query, mutate, getClient } from "svelte-apollo";
  import { gql } from "apollo-boost";
  import { onMount } from "svelte";

  //I got this package for toast! hope this works!!
  import Toast from "svelte-toast"

  //instantiate toast
  const toast = new Toast()

  //get our client
  const client = getClient();

  //Query to get a single Todo
  const GET_TODO = gql`
    query($id: ID!) {
      getTodo(id: $id) {
        body
      }
    }
  `;

  //Mutation to edit a Todo body
  const EDIT_TODO = gql`
    mutation($id: ID!, $body: String!) {
      editTodo(id: $id, body: $body) {
        body
      }
    }
  `;

  //id from params
  export let params = "";
  const id = String(params.id);

  //default value to input
  let body = "";

  onMount(async () => {
    try {
      let res = await query(client, {
        query: GET_TODO,
        variables: { id },
      }).result();
      if (res) {
        // console.log(res);
        body = res.data.getTodo.body;
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onEdit = async () => {
    try {
      const res = await mutate(client, {
        mutation: EDIT_TODO,
        variables: { id, body },
      });
      if (res) {
        toast.success("updated");
        setTimeout(() => page.redirect("/"), 2300)
      }
    } catch (error) {
      console.error(error);
    }
  };

 
</script>


<div class="col-12">
  <div class="card textcenter mt-3">
    <div class="card-header bg-primary text-white">
      <i class="fa fa-pencil mr-3" />EDIT YOUR TODO
    </div>
    <div class="card-body">
      <form on:submit|preventDefault={onEdit}>
        <div class="form-group form-row">
          <label
            class="col-md-2 col-form-label text-md-right"
            for="todo_body">EDIT:
          </label>
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
            <button type="submit" class="btn btn-primary d-block ml-auto">
              Edit your todo
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

