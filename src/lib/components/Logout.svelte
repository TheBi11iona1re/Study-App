<script lang="ts">
    import { auth } from '$lib/store/authStore';

    async function logout(): Promise<void> {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
</script>

<button on:click={logout}>Log out</button>
