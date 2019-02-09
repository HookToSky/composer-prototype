
/**
 * Authorize Access transaction function.
 * @param {org.example.prototype.AuthorizeRequest} tx itThe sample transaction instance.
 * @transaction
 */
async function AuthorizeRequest(tx) {
    const document = tx.doc;
  // Get the participant registry for the asset.
  const requestorRegistry = await getParticipantRegistry('org.example.prototype.Requestor');
  const requestor = await requestorRegistry.get(tx.requestorId);
     const index = document.requestor ? document.requestor.indexOf(tx.requestorId) : -1;
  if (document.ownerId == tx.ownerId && index < 0) {
      document.requestor.push(tx.requestorId);
      // Update the asset in the asset registry.
      const docRegistry = await getAssetRegistry('org.example.prototype.Document');
      await docRegistry.update(document);
  }
}
/**
* Revoke Access transaction function.
* @param {org.example.prototype.RevokeRequest} tx The sample transaction instance.
* @transaction
*/
async function RevokeRequest(tx) {
  // Get the participant registry for the requestor.
  const requestorRegistry = await getParticipantRegistry('org.example.prototype.Requestor');
  const requestor = await requestorRegistry.get(tx.requestorId);
  const document = tx.doc;
  const index = document.requestor ? document.requestor.indexOf(tx.requestorId) : -1;
  if (document.ownerId == tx.ownerId && index > -1) {
      document.requestor.splice(index, 1);
      const docRegistry = await getAssetRegistry('org.example.prototype.Document');
      await docRegistry.update(document);
  }
}
/**
* Add Documents transaction function.
* @param {org.example.prototype.AddDocument} tx The sample transaction instance.
* @transaction
*/
async function AddDocument(tx) {
  const factory = getFactory();
  let documents = await getAssetRegistry('org.example.prototype.Document');
  const isDocSubmitted = await documents.exists(tx.docId);
  const users = await getParticipantRegistry('org.example.prototype.User');
  const owner = await users.get(tx.ownerId);
  const document = factory.newResource('org.example.prototype', 'Document', tx.docId);
  document.hashId = tx.hashId;
  document.ownerId = tx.ownerId;
    document.requestor = [];
  await documents.add(document);
  owner.documents.push(document);
  await users.update(owner);

}