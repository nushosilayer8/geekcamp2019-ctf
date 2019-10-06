<template>
	<div class="full">
		<form class="form-signin">
			<div class="text-center mb-4">
				<h1 class="h3 mb-3 font-weight-normal">Login to MediumApp</h1>
			</div>
			
			<div class="alert alert-danger" role="alert" v-if="error">
				{{ error }}
			</div>

			<div class="form-label-group">
				<input type="username" class="form-control" placeholder="Username" required autofocus v-model="username">
				<label for="inputUsername">Username</label>
			</div>

			<button class="btn btn-lg btn-primary btn-block" type="submit" @click.prevent="signin">Sign in</button>
		</form>
	</div>
</template>

<script>
import { authorize } from '~/common/auth.js';
export default {
	components: {
	},
	data() {
		return {
			error: '',
			username: '',
		};
	},
	methods: {
		signin() {
			try {
				const token = authorize(this.username);
				this.$cookies.set('token', token);
				this.$router.push('home');
			} catch (e) {
				this.error = e.message;
			}
		},
	},
}
</script>

<style scoped>
.full {
	width: 100vw;
	height: 100vh;

	display: -ms-flexbox;
	display: flex;
	-ms-flex-align: center;
	align-items: center;
	padding-top: 40px;
	padding-bottom: 40px;
	background-color: #f5f5f5;
}

.form-signin {
	width: 100%;
	max-width: 420px;
	padding: 15px;
	margin: auto;
}

.form-label-group {
	position: relative;
	margin-bottom: 1rem;
}

.form-label-group > input,
.form-label-group > label {
	height: 3.125rem;
	padding: .75rem;
}

.form-label-group > label {
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	margin-bottom: 0; /* Override default `<label>` margin */
	line-height: 1.5;
	color: #495057;
	pointer-events: none;
	cursor: text; /* Match the input under the label */
	border: 1px solid transparent;
	border-radius: .25rem;
	transition: all .1s ease-in-out;
}

.form-label-group input::-webkit-input-placeholder {
	color: transparent;
}

.form-label-group input:-ms-input-placeholder {
	color: transparent;
}

.form-label-group input::-ms-input-placeholder {
	color: transparent;
}

.form-label-group input::-moz-placeholder {
	color: transparent;
}

.form-label-group input::placeholder {
	color: transparent;
}

.form-label-group input:not(:placeholder-shown) {
	padding-top: 1.25rem;
	padding-bottom: .25rem;
}

.form-label-group input:not(:placeholder-shown) ~ label {
	padding-top: .25rem;
	padding-bottom: .25rem;
	font-size: 12px;
	color: #777;
}
</style>
