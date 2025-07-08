

````bash
gemini code --apply \
  --path app/page.js \
  --prompt "
In `app/page.js`, automate ‘remember visit’ using cookies by making these edits:

1. **Import `useEffect`**  
   At the top of the file (below existing React imports), add:
   ```js
   import { useEffect } from 'react';
````

2. **Check cookie on mount**\
   Find your splash-state declaration, for example:

   ```js
   const [showSplash, setShowSplash] = useState(true);
   ```

   Immediately below it, insert:

   ```js
   useEffect(() => {
     // look for hasVisited cookie
     if (document.cookie.split('; ').some(c => c.startsWith('hasVisited='))) {
       setShowSplash(false);
     }
   }, []);
   ```

3. **Set the cookie on form submit**\
   In your splash form handler (before any fetch or redirect), insert:

   ```js
   // persist visit flag for 1 year
   document.cookie = 'hasVisited=true; Max-Age=31536000; path=/';
   ```

4. **Ensure the form uses the handler**\
   Replace or verify your `<form>` tag reads:

   ```jsx
   <form id="contact-form" onSubmit={handleSubmit}>
   ```

This command will skip the splash for returning visitors who have the `hasVisited` cookie set, and will set that cookie when they first submit the form."\`\`\`

