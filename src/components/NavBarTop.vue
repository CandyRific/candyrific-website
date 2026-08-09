<template>
    <nav class="top-nav">
        <ul class="bar">
            <li><a class="top-button">RESOURCES</a></li>
            <li><a class="top-button">WHERE TO BUY</a></li>
            <li><a class="broker-button">LOGIN</a></li>
        </ul>
    </nav>
</template>

<script setup>

</script>

<style  scoped>
.top-nav {
    width: 100%;
    z-index: 2;
}

@media (min-width: 768px) {
    .top-nav {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 2;
    }
}

.bar{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding:  1.5rem;
    justify-content: flex-end;
    color: white;
    background: linear-gradient(
    90deg,
    #6d3692 0%,
    #6250a1 25%,
    #3f6fb5 50%,
    #007fc5 65%,
    #00aced 100%
    );
    font-family: 'Fredoka', sans-serif;
    list-style-type: none;
}

.bar li {
    white-space: nowrap;
    font-size: clamp(.75rem, 1vw, 1rem);
}


.broker-button {
    border: 1px solid white;
    border-radius: 5px;
    padding: .5rem;
}

.broker-button:hover {
    background-color: rgba(0,0,0,0.1);
    border-radius: 5px;
    border: 1px solid white;
    padding: .5rem;
}


.top-button {
    border-radius: 5px;
    padding: .5rem;
}

.top-button:hover {
    background-color: rgba(0,0,0,0.1);
    border-radius: 5px;
    padding: .5rem;
}
</style>