/**
 * Created by bantonides on 12/19/13.
 */
function mapFromXml(db, feedId, source) {
  return new db.models.Source({
    elementId: source.$.id,
    vipId: source.vip_id,
    datetime: source.datetime,
    description: source.description,
    name: source.name,
    organizationUrl: source.organization_url,
    feedContactId: source.feed_contact_id,
    _feed: feedId
  });
}

exports.mapXml = mapFromXml;