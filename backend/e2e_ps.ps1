$buyer = @{ email='testbuyer@example.com'; password='Password123!' }
$farmer = @{ email='testfarmer@example.com'; password='Password123!' }

Write-Output "=== SIGNIN BUYER ==="
$buyerResp = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/signin' -Method Post -ContentType 'application/json' -Body ($buyer | ConvertTo-Json)
$buyerResp | ConvertTo-Json -Depth 5
$buyerToken = $buyerResp.data.session.access_token
Write-Output "BUYER_TOKEN: $buyerToken"

Write-Output "=== POST NEED ==="
$postBody = @{
  crop_name = 'wheat'
  quantity = 10
  location = 'Testville'
  expected_price = 'INR15000'
  delivery_date = '2026-02-01'
  contact_phone = '+911234567890'
  description = 'Test order'
}
$postResp = Invoke-RestMethod -Uri 'http://localhost:3001/api/buyer-needs' -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $buyerToken" } -Body ($postBody | ConvertTo-Json)
$postResp | ConvertTo-Json -Depth 5

Write-Output "=== SIGNIN FARMER ==="
$farmerResp = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/signin' -Method Post -ContentType 'application/json' -Body ($farmer | ConvertTo-Json)
$farmerResp | ConvertTo-Json -Depth 5
$farmerToken = $farmerResp.data.session.access_token
Write-Output "FARMER_TOKEN: $farmerToken"

Write-Output "=== GET NEEDS AS FARMER ==="
$getResp = Invoke-RestMethod -Uri 'http://localhost:3001/api/buyer-needs' -Method Get -Headers @{ Authorization = "Bearer $farmerToken" }
$getResp | ConvertTo-Json -Depth 5
