const html = `<p>Messages can be signed off chain and then verified on chain using a smart contract.</p>
<pre><code class="language-solidity">pragma solidity ^0.5.11;

contract VerifySignature {
  // Signature is produced by signing a hash with the following format:
  // - prefix of "\\x19Ethereum Signed Message\\n"
  // - length of message
  // - actual message
  function getHash() public pure returns (bytes32) {
    // Here we are computing the hash of "Hello World", which has length 11.
    return keccak256(abi.encodePacked("\\x19Ethereum Signed Message:\\n11", "Hello World"));
  }

  // Let&#39;s sign "Hello World" (without quotes) using Remix
  // You will see a dialog box with the following output

  // hash
  // 0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2
  // signature (this will be different depending on the account)
  // 0x16a16577ba9ac82469ce52db5ea70f622c644006a343649d2b3775ac1470bc49394479b4f97a5baefe82abad836e4648f31c59c564652ea735a8c17d1204f37300

  // Next we recover the signer from the hash and signature.
  // Execute this function below inputting the hash and your signature.

  // If the signature or hash is valid the function will return
  // the address of the signer, otherwise a zero address.
  function recoverSigner(bytes32 _hash, bytes memory _signature)
    public
    pure
    returns (address)
  {
    // Splitting the signature. We can ignore the details.
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(_signature);

    // There is a bug in Remix IDE, so we fix &#39;v&#39; to the expected value,  0x1b
    // return ecrecover(_hash, v, r, s);
    return ecrecover(_hash, 0x1b, r, s);
  }

  function splitSignature(bytes memory sig)
    public
    pure
    returns (uint8 v, bytes32 r, bytes32 s)
  {
    require(sig.length == 65);

    assembly {
      // first 32 bytes, after the length prefix
      r := mload(add(sig, 32))
      // second 32 bytes
      s:= mload(add(sig, 64))
      // final byte (first byte of the next 32 bytes)
      v := byte(0, mload(add(sig, 0)))
    }

    return (v, r, s);
  }
}
</code></pre>
`

export default html
