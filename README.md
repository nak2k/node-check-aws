# check-aws

Check AWS environment you use is right.

## Installation

```
npm i -D check-aws
```

## Usage

Configure valid AWS environments in package.json:

```
{
  "check-aws": {
    "accountIds": [
      "123456789012"
    ]
  }
}
```

then, use the CLI command `check-aws`:

```
$ check-aws
```

or, call the API in your script:

```
import { checkAws } from "check-aws";

await checkAws();
```

## License

MIT
