# Gemini CLI Prompt: Remember Form Submission

Below is a Gemini CLI command that you can paste into your terminal to automate adding “remember form submission” functionality into your Next.js project (`mrndcontact`):

```bash
gemini code --apply \
  --path app/page.js \
  --prompt "
In `app/page.js`, automate “remember form submission” by making these edits:

1. **Import `useEffect`**  
   At the top of the file (below existing React imports), add:
   ```js
   import { useEffect } from 'react';
   ```

2. **Check for submission flag on mount**  
   Find your splash-state declaration, for example:
   ```js
   const [showSplash, setShowSplash] = useState(true);
   ```
   Immediately below it, insert:
   ```js
   useEffect(() => {
     if (localStorage.getItem('formSubmitted') === 'true') {
       setShowSplash(false);
     }
   }, []);
   ```

3. **Set the flag on form submit**  
   Locate your form submit handler (the function passed to `<form onSubmit={…}>`) and, before any fetch or redirect logic, insert:
   ```js
   localStorage.setItem('formSubmitted', 'true');
   ```

4. **Ensure the form uses the handler**  
   Replace your existing `<form>` tag with:
   ```jsx
   <form id="contact-form" onSubmit={handleSubmit}>
   ```

This setup will:
- Check on component mount and skip the splash page for returning visitors.
- Mark the visitor as “submitted” in `localStorage` upon first submission.

Feel free to adjust the redirect logic or element IDs to match your project’s specifics.
"```

