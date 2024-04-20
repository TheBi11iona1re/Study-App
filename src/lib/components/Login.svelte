<script lang="ts">
    import { auth } from '$lib/store/authStore';
    import { goto } from '$app/navigation';

    let email: string = '';
    let password: string = '';
    let errorMessage: string = '';

    async function login(): Promise<void> {
        try {
            const session = await auth.signIn(email, password);
            if (session) {
              
            }
        } catch (error) {
            errorMessage = error.message;
            console.error('Login error:', error);
        }
    }
</script>

<!-- Remaining HTML and CSS from previous example -->
