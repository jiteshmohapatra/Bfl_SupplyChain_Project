package org.pih.warehouse.product

import org.junit.Ignore
import org.junit.Test
import org.pih.warehouse.core.Constants
import org.pih.warehouse.core.Location
import org.pih.warehouse.core.LocationType
import org.pih.warehouse.core.Synonym
import org.pih.warehouse.core.SynonymTypeCode
import org.pih.warehouse.inventory.InventoryStatus
import org.pih.warehouse.product.Category
import org.pih.warehouse.product.Product
import org.pih.warehouse.product.ProductGroup
import testutils.DbHelper

@Ignore
class ProductIntegrationTests extends GroovyTestCase {

    @Test
    void getInventoryLevels_shouldNotFailOnNonPersistedProduct() {
        def product = new Product();
        product.getInventoryLevels()
    }

    @Test
    void getInventoryLevel_shouldNotFailOnNonPersistedProduct() {
        def bostonLocation = DbHelper.findOrCreateLocationWithInventory('Boston Location')
        def product = new Product()
        product.getInventoryLevel(bostonLocation.id)
    }


    @Test
    void testSaveProductProductGroup(){
        def suppliers = DbHelper.findOrCreateCategory('Supplies')
        def name = "Test" + UUID.randomUUID().toString()[0..5]
        def group = new ProductGroup(name: name + "group", category: suppliers)
        assert group.save(flush:true, failOnError:true)
        def productType = DbHelper.findOrCreateProductType("Default")
        def product = new Product(name: name, category: suppliers, productType: productType)
        product.addToProductGroups(group)
        assert product.save(flush:true, failOnError:true)

        group.addToProducts(product)
        assert group.save(flush:true, failOnError:true)
        assert product.productGroups.contains(group)
        assert group.products.contains(product)


    }


    // FIXME the ProductGroup under test is never initialized
    @Ignore
    void testGetProductFromGroup() {
       def group = ProductGroup.findByName("PainKiller")
        def products = group.products
        assert products.any{p -> p.name == "Advil 200mg"}
        assert products.any{p -> p.name == "Tylenol 325mg"}

    }

    // FIXME the Product under test is never initialized
    @Ignore
    void testGetProductGroup() {
        def product = Product.findByName("MacBook Pro 8G")
        def groups = product.productGroups
        assert groups.any{g -> g.name == "Laptop"}
    }

    @Test
    void testLatestInventoryDate(){
      def product = DbHelper.findOrCreateProduct('TestProductABC')
      def depotLocationType = LocationType.get(Constants.WAREHOUSE_LOCATION_TYPE_ID)
      Location boston = DbHelper.findOrCreateLocation('Boston Headquarters', depotLocationType)
      Location miami = DbHelper.findOrCreateLocation('Miami Warehouse', depotLocationType)
      def tenDaysAgo = new Date().minus(10)
      def fiveDaysAgo = new Date().minus(5)
      def threeDaysAgo = new Date().minus(3)
      def sevenDaysAgo = new Date().minus(7)
      DbHelper.recordProductInventory(product, boston, "tets1234234", new Date().plus(100), 300, tenDaysAgo)
      DbHelper.recordProductInventory(product, boston, "tets1234234", new Date().plus(100), 300, sevenDaysAgo)
      DbHelper.recordProductInventory(product, miami, "tets12323412", new Date().plus(100), 300, fiveDaysAgo)
      DbHelper.transferStock(product, boston, "tets1234234", 999, threeDaysAgo, miami)

      def dateForBoston = product.latestInventoryDate(boston.id)
      def dateForMiami = product.latestInventoryDate(miami.id)
      assert dateForBoston.format("MM/dd/yyyy") == sevenDaysAgo.format("MM/dd/yyyy")
      assert dateForMiami.format("MM/dd/yyyy") == fiveDaysAgo.format("MM/dd/yyyy")
    }


    @Test
    void getBinLocation_shouldReturnCorrectBinLocation() {
        def product = DbHelper.findOrCreateProduct('TestProductABC')
        Location boston = DbHelper.findOrCreateLocationWithInventory('Boston Headquarters')
        def inventoryLevel = DbHelper.createInventoryLevel(product, boston, "A1-01-01", InventoryStatus.SUPPORTED, 0, 100, 500)
        assertNotNull inventoryLevel
        assertEquals "A1-01-01", product.getBinLocation(boston.id)
    }

    @Test
    void getBinLocation_shouldReturnNullWhenInventoryLevelIsNull() {
        def product = DbHelper.findOrCreateProduct('TestProductABC')
        Location boston = DbHelper.findOrCreateLocationWithInventory('Boston Headquarters')
        assertNull product.getBinLocation(boston.id)
    }

    @Test
    void getBinLocation_shouldReturnNullWhenBinLocationIsNull() {
        def product = DbHelper.findOrCreateProduct('TestProductABC')
        Location boston = DbHelper.findOrCreateLocationWithInventory('Boston Headquarters')
        def inventoryLevel = DbHelper.createInventoryLevel(product, boston, null, InventoryStatus.SUPPORTED, 0, 100, 500)
        assertNotNull inventoryLevel
        assertNull product.getBinLocation(boston.id)
    }


    @Test
    void deleteSynonym_shouldCascadeOnDelete() {
        def category = new Category(name: "new category").save(flush: true)
        def productType = DbHelper.findOrCreateProductType("Default")
        def product1 = new Product(name: "new product 1", category: category, productType: productType).save(flush: true, failOnError: true)

        def synonym = new Synonym(name: "new synonym", synonymTypeCode: SynonymTypeCode.DISPLAY_NAME, locale: new Locale("en"))
        product1.addToSynonyms(synonym)
        product1.save(flush: true)

        println "Synonyms: " + Synonym.list().size()

        assertEquals 1, product1.synonyms.size()
        assertNotNull Synonym.findByName("new synonym")
        println "Synonyms: " + Synonym.list().size()

        // Remove the synonym from product synonyms, which should not cause a cascade delete on synonym
        product1.removeFromSynonyms(synonym)
        println "Synonyms: " + Synonym.list().size()

        assertEquals 0, product1.synonyms.size()
        assertNull Synonym.findByName("new synonym")


    }

    @Test
    void deleteProduct_shouldCascadeOnDelete() {
        def category = new Category(name: "new category").save(flush: true)
        def productType = DbHelper.findOrCreateProductType("Default")
        def product1 = new Product(name: "new product 1", category: category, productType: productType).save(flush: true, failOnError: true)

        def synonym = new Synonym(name: "new synonym", synonymTypeCode: SynonymTypeCode.DISPLAY_NAME, locale: new Locale("en"))
        product1.addToSynonyms(synonym)
        product1.save(flush: true)


        assertNotNull Synonym.findByName("new synonym")

        assertEquals 1, product1.synonyms.size()

        product1.delete()

        assertNull Synonym.findByName("new synonym")

    }


    // This test no longer makes sense because synonym is one-to-many association with product
    @Ignore
    void deleteProduct_shouldNotCascadeOnDeleteWhenReferencedFromAnotherProduct() {
        def category = new Category(name: "new category").save(flush: true)
        def productType = DbHelper.findOrCreateProductType("Default")
        def product1 = new Product(name: "new product 1", category: category, productType: productType).save(flush: true, failOnError: true)
        def product2 = new Product(name: "new product 2", category: category, productType: productType).save(flush: true, failOnError: true)

        def synonym = new Synonym(name: "new synonym", synonymTypeCode: SynonymTypeCode.DISPLAY_NAME)
        product1.addToSynonyms(synonym)
        product1.save(flush: true)

        product2.addToSynonyms(synonym)
        product2.save(flush: true)

        assertNotNull Product.findByName("new product 1")
        assertEquals 1, product1.synonyms.size()
        assertEquals 1, product2.synonyms.size()
        assertNotNull Synonym.findByName("new synonym")

        product1.delete()

        assertNull Product.findByName("new product 1")
        assertEquals 0, product1?.synonyms?.size()
        assertEquals 1, product2.synonyms.size()
        assertNotNull Synonym.findByName("new synonym")

    }


}
