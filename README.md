# ECPay Logistics Node.js SDK

Un official ECPay Logistics (綠界物流) SDK for Node.js, written in TypeScript.

## Features

- **Full TypeScript Support**: Typed interfaces and Enums for all ECPay parameters.
- **Fluent API**: Builder pattern for easy construction of requests.
- **Dual Support**: CommonJS (CJS) and ES Modules (ESM).
- **Security**: Automatic `CheckMacValue` generation and verification.
- **Complete Operations**:
  - **CVS (Convenience Store)**: Create, Update, Cancel, Return orders.
  - **Home Delivery**: Create via T-Cat (黑貓) or Post (郵局), Return orders.
  - **Map**: OpenStoreMap (Electronic Map).
  - **Printing**: Waybills for B2C/Home and C2C.
  - **Queries**: Trade Info, Store Lists.
  - **Notifications**: Server Reply handling.

## Installation

with npm

```
npm install 
```

## Usage

### 1. Initialize

This SDK provides individual classes for each operation. You don't need a central client instance for everything, but you need your Merchant config.

```typescript
// Common config
const MERCHANT_ID = '2000132'
const HASH_KEY = '5294y06JbISpM5x9'
const HASH_IV = 'v77hoKGq4kWxNNIS'
```

### 2. Open Map (CVS Selection)

```typescript
import { OpenStoreMap, IsCollection } from 'ecpay-logistics-node'

const map = new OpenStoreMap(MERCHANT_ID, HASH_KEY, HASH_IV)

map
  .setMerchantTradeNo('T' + Date.now())
  .setServerReplyURL('https://your-site.com/map/callback')
  .useUnimartC2C() // or .useFamiC2C(), .useUnimartB2C(), etc.
  .useMobileDevice()
  .setIsCollection(IsCollection.NO)

const html = map.getContent() // Actually generates payload, you need to POST this to map.getRequestPath()
// Note: For Map, you typically create a form and submit it to the URL.
// The SDK generates the parameters (CheckMacValue included).
console.log(map.getRequestPath()) // '/Express/map'
console.log(html)
```

### 3. Create CVS Order (C2C)

```typescript
import { CreateCvsOrder } from 'ecpay-logistics-node'

const create = new CreateCvsOrder(MERCHANT_ID, HASH_KEY, HASH_IV)

create
  .useUnimartC2C()
  .setMerchantTradeNo('T' + Date.now())
  .setMerchantTradeDate(new Date())
  .setServerReplyURL('https://your-site.com/logistics/callback')
  .setSenderName('Wang Xiao-Ming')
  .setSenderCellPhone('0912345678')
  .setReceiverName('Chen Xiao-Hua')
  .setReceiverCellPhone('0998765432')
  .setReceiverStoreID('123456') // From Map callback
  .setGoodsAmount(100)
  .setGoodsName('Test Item')

const payload = create.getContent()
// Use an HTTP client (axios, fetch) to POST 'payload' to headers 'application/x-www-form-urlencoded'
// URL: create.getRequestPath() -> '/Express/Create' or full URL https://logistics-stage.ecpay.com.tw/Express/Create
```

### 4. Printing Waybills

**For B2C / Home Delivery:**

```typescript
import { PrintTradeDocument } from 'ecpay-logistics-node'

const print = new PrintTradeDocument(MERCHANT_ID, HASH_KEY, HASH_IV)
print.useUnimartB2C().setAllPayLogisticsID('12345678')

const payload = print.getContent()
// Submit this payload to /helper/printTradeDocument to get the HTML
```

**For C2C CVS:**

```typescript
import { PrintCvsDocument } from 'ecpay-logistics-node'

const printCvs = new PrintCvsDocument(MERCHANT_ID, HASH_KEY, HASH_IV)
printCvs.forUnimart('112233', '1234') // ValidationNo needed for C2C

const payload = printCvs.getContent()
// Submit to printCvs.getRequestPath()
```

### 5. Notifications

Verify callback checks sum:

```typescript
import { LogisticsNotify } from 'ecpay-logistics-node'

// In your route handler (e.g., Express)
app.post('/callback', (req, res) => {
  const data = req.body

  // Verify CheckMacValue
  if (!LogisticsNotify.verify(data, HASH_KEY, HASH_IV)) {
    return res.status(400).send('Bad Checksum')
  }

  // Parse data safely
  const info = new LogisticsNotify(data)
  const logisticsId = info.get('AllPayLogisticsID')
  const status = info.get('RtnCode')

  res.send('1|OK')
})
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and set up your development environment.

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Security

For security policy and vulnerability reporting, please refer to [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
