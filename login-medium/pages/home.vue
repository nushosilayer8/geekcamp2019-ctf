<template>
	<div>
		<nav class="navbar navbar-dark bg-dark">
			<span class="navbar-brand">MediumApp</span>
			
			<form class="form-inline my-2 my-lg-0">
				<button class="btn btn-outline-success my-2 my-sm-0" @click.prevent="signout">Sign out</button>
			</form>
		</nav>

		<div class="jumbotron text-center">
			<h1 class="display-4">Hello!</h1>
			<p class="lead">{{ message }}</p>
		</div>
	</div>
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			message: '',
		};
	},
	methods: {
		signout() {
			this.$cookies.remove('token');
			this.$router.push('/');
		}
	},
	created() {
		(async () => {
			try {
				const res = await fetch('/api/flag', {
					method: 'POST'
				});
				const message = await res.text();
				this.message = message;
			} catch (e) {
				this.message = e.message;
			}
		})();
	}
}
</script>

