const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "analytics";
const containerId = "pageViews";

module.exports = async function (context, req) {
  const container = client.database(databaseId).container(containerId);
  const { resource } = await container.item("counter", "counter").read();

  resource.count += 1;

  await container.items.upsert(resource);

  context.res = {
    status: 200,
    body: { count: resource.count }
  };
};
