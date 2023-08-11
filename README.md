# ```solr-xml-to-jsonl```

This is a simple CLI utility to convert data in SOLR XML format to a JSONL file.

## Usage:

```bash
npx solr-xml-to-jsonl <path/to/input_solr_data.xml> <path/to/output.jsonl>
```

This is the expected format of `input_solr_data.xml`:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<add>
    <docs>
        <doc>
            <field name="product_name">Water Bottle</field>
            <field name="price">1.99</field>
            <field name="description">A bottle of water</field>
            <field name="in_stock">true</field>
        </doc>
        <doc>
            <field name="product_name">Lemonade</field>
            <field name="price">2.99</field>
            <field name="description">A bottle of lemonade</field>
            <field name="in_stock">true</field>
        </doc>
    </docs>
</add>
```

After running this command, the output JSONL will be in this format:

```json lines
{"product_name":"Water Bottle","price":1.99,"description":"A bottle of water","in_stock":true}
{"product_name":"Lemonade","price":2.99,"description":"A bottle of lemonade","in_stock":true}
```
