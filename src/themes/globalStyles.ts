import { createGlobalStyle } from "styled-components";
// import { theme } from ".";

const GlobalStyles = createGlobalStyle`
    :root {
        font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    a {
        font-weight: 500;
        color: hsl(var(--primary));
        text-decoration: inherit;
    }

    a:hover {
        color: hsl(var(--ring));
    }

    body {
        margin: 0;
        align-items: center;
        justify-content: center;
        min-width: 320px;
        min-height: 100vh;
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
    }

    h1 {
        font-size: 3.2em;
        line-height: 1.1;
    }

    button {
        border-radius: 8px;
        border: 1px solid hsl(var(--border));
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: border-color 0.25s;
    }

    button:hover {
        border-color: hsl(var(--ring));
    }
    button:focus,
    button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
    }

    /* Custom Scrollbar - Thon và nhạt màu hơn */
    * {
        scrollbar-width: thin;
        scrollbar-color: rgba(155, 155, 155, 0.3) transparent;
    }

    *::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    *::-webkit-scrollbar-track {
        background: transparent;
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgba(155, 155, 155, 0.3);
        border-radius: 10px;
        border: none;
    }

    *::-webkit-scrollbar-thumb:hover {
        background-color: rgba(155, 155, 155, 0.5);
    }
`;

export default GlobalStyles;
