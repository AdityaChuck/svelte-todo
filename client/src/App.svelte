<script>
	//setup apollo
	import ApolloClient from 'apollo-boost'
	import { setClient } from 'svelte-apollo'

	//initialize your client
	const client = new ApolloClient({
		uri: 'http://localhost:3000/graphql'
	})
	setClient(client)
	//cool, apollo setup is done!

	//import components
	import Todos from "./components/Todos.svelte"
	import EditTodo from "./components/EditTodo.svelte"

	import router from "page"

	let page
	let params

	router('/', () => page = Todos)
	router('/:id', (ctx,next) => {
		params = ctx.params
		next()
	},() => page = EditTodo)
	router("/*", () => page = Todos)
	router.start()
</script>

<main>
	<div class="container">
		<div class="row justify-content-center">
			<!-- <Todos /> -->
			
			<svelte:component this={page} {params}/>
		</div>
	</div>
</main>

