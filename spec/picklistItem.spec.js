describe('picklistItem', () => {
  it('quantity picked should not greater than quantity ATP', () => {
    const item = new openboxes.requisition.PicklistItem({ quantityATP: 4000 });
    item.quantity(1000);
    expect(item.quantity()).toEqual(1000);
    item.quantity(4001);
    expect(item.quantity()).toEqual(4000);
  });
});
