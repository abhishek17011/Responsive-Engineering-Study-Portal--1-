# Push notifications

This project sends browser push notifications only to users who have installed Engineer Vault and explicitly enabled notifications.

## One-time Vercel configuration

1. Create an Upstash Redis database and copy its REST URL and REST token.
2. Generate VAPID keys locally:

   ```powershell
   npx web-push generate-vapid-keys
   ```

3. In the Vercel project settings, add these environment variables from `.env.example` for Production, Preview, and Development:

   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_SUBJECT`
   - `PUSH_ADMIN_TOKEN` — use a long, unique secret.
4. Deploy the project again.

## Send an announcement

Run this command from PowerShell after replacing the values. Keep the token private.

```powershell
$headers = @{ Authorization = "Bearer YOUR_PUSH_ADMIN_TOKEN" }
$body = @{ title = "Engineer Vault"; body = "Third-year resources are now being added."; url = "/" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://bamu-nep-pyq-engineer-vault.vercel.app/api/send-notification" -Headers $headers -ContentType "application/json" -Body $body
```

Only users who installed the app and tapped **Enable notifications** receive the message. iPhone/iPad users must open the installed home-screen app before the browser can offer permission.
