# QR System Diagnostic Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  QR SYSTEM DIAGNOSTIC TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$API_URL = "http://localhost:5001"

# Test 1: Backend Health
Write-Host "Test 1: Backend Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$API_URL/api/health" -Method Get
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
    Write-Host "   Time: $($health.timestamp)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
    exit 1
}

# Test 2: Get QR Code
Write-Host "Test 2: Get QR Code for Table T-001" -ForegroundColor Yellow
try {
    $qrCode = Invoke-RestMethod -Uri "$API_URL/api/qrcode/table/T-001" -Method Get
    Write-Host "✅ QR Code retrieved!" -ForegroundColor Green
    Write-Host "   Table: $($qrCode.tableId)" -ForegroundColor Gray
    Write-Host "   Zone: $($qrCode.zone)" -ForegroundColor Gray
    Write-Host "   Active: $($qrCode.isActive)" -ForegroundColor Gray
    $token = $qrCode.qrToken
    Write-Host "   Token: $($token.Substring(0, 50))...`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get QR code!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
    exit 1
}

# Test 3: Validate QR Token
Write-Host "Test 3: Validate QR Token" -ForegroundColor Yellow
try {
    $body = @{ token = $token } | ConvertTo-Json
    $validation = Invoke-RestMethod -Uri "$API_URL/api/qrcode/validate" -Method Post -Body $body -ContentType "application/json"
    
    if ($validation.valid) {
        Write-Host "✅ Token is VALID!" -ForegroundColor Green
        Write-Host "   Table: $($validation.data.tableId)" -ForegroundColor Gray
        Write-Host "   Zone: $($validation.data.zone)" -ForegroundColor Gray
        Write-Host "   Has Active Session: $($validation.data.hasActiveSession)`n" -ForegroundColor Gray
    } else {
        Write-Host "❌ Token is INVALID!" -ForegroundColor Red
        Write-Host "   Message: $($validation.message)`n" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Validation failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
    exit 1
}

# Test 4: Create Customer Session
Write-Host "Test 4: Create Customer Session" -ForegroundColor Yellow
try {
    $sessionBody = @{
        qrToken = $token
        customerName = "Test Customer"
        guestCount = 2
    } | ConvertTo-Json
    
    $session = Invoke-RestMethod -Uri "$API_URL/api/customer/login" -Method Post -Body $sessionBody -ContentType "application/json"
    Write-Host "✅ Session created successfully!" -ForegroundColor Green
    Write-Host "   Session ID: $($session.session.id)" -ForegroundColor Gray
    Write-Host "   Table: $($session.session.tableId)" -ForegroundColor Gray
    Write-Host "   Guests: $($session.session.guestCount)`n" -ForegroundColor Gray
    $sessionToken = $session.sessionToken
} catch {
    Write-Host "❌ Session creation failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)`n" -ForegroundColor Red
}

# Test 5: Get Menu
Write-Host "Test 5: Get Menu Items" -ForegroundColor Yellow
try {
    $menu = Invoke-RestMethod -Uri "$API_URL/api/menu" -Method Get
    Write-Host "✅ Menu retrieved!" -ForegroundColor Green
    Write-Host "   Total items: $($menu.Count)" -ForegroundColor Gray
    if ($menu.Count -gt 0) {
        Write-Host "   First item: $($menu[0].name) - ₹$($menu[0].price)`n" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to get menu!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
}

# Generate Test URL
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST URL FOR CUSTOMER FRONTEND" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$encodedToken = [System.Web.HttpUtility]::UrlEncode($token)
$testUrl = "http://localhost:3001?token=$encodedToken"

Write-Host "Copy this URL and open in your browser:`n" -ForegroundColor Yellow
Write-Host $testUrl -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ALL TESTS COMPLETED!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
