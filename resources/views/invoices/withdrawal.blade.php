<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: sans-serif;
            color: #262C55;
            padding: 40px;
        }

        h1 {
            color: #262C55;
            font-size: 20px;
        }

        .accent {
            color: #FB9129;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        td {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .label {
            color: #888;
            font-size: 12px;
            text-transform: uppercase;
        }
    </style>
</head>

<body>
    <h1>United Care Alliance <span class="accent">(UCA)</span> — Withdrawal Invoice</h1>
    <p class="label">Invoice Number</p>
    <p>{{ $invoiceNumber }}</p>

    <table>
        <tr>
            <td class="label">Recipient</td>
            <td>{{ $withdrawal->user->name }} ({{ $withdrawal->user->email }})</td>
        </tr>
        <tr>
            <td class="label">Amount</td>
            <td>${{ number_format($withdrawal->amount, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Method</td>
            <td>{{ ucfirst($withdrawal->method) }}</td>
        </tr>
        <tr>
            <td class="label">Reference</td>
            <td>{{ $withdrawal->reference }}</td>
        </tr>
        <tr>
            <td class="label">Paid At</td>
            <td>{{ $withdrawal->paid_at->format('F j, Y g:i A') }}</td>
        </tr>
    </table>
</body>

</html>