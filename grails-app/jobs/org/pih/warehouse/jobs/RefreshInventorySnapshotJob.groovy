/**
 * Copyright (c) 2012 Partners In Health.  All rights reserved.
 * The use and distribution terms for this software are covered by the
 * Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
 * which can be found in the file epl-v10.html at the root of this distribution.
 * By using this software in any fashion, you are agreeing to be bound by
 * the terms of this license.
 * You must not remove this notice, or any other, from this software.
 **/
package org.pih.warehouse.jobs

import org.pih.warehouse.core.Location
import org.pih.warehouse.product.Product
import org.quartz.JobExecutionContext

class RefreshInventorySnapshotJob {

    def inventorySnapshotService

    static concurrent = false

    def sessionRequired = false

    // Should never be triggered on a schedule - should only be triggered by persistence event listener
    static triggers = {}

    void execute(JobExecutionContext context) {

        if (JobUtils.shouldExecute(RefreshInventorySnapshotJob)) {
            log.info("Refreshing inventory snapshots with data: ${context.mergedJobDataMap}")
            def startTime = System.currentTimeMillis()
            def userId = context.mergedJobDataMap.get('user')
            def date = context.mergedJobDataMap.get('date')
            def locationId = context.mergedJobDataMap.get('locationId')
            def productId = context.mergedJobDataMap.get('productId')
            try {
                Product product = Product.load(productId)
                Location location = Location.load(locationId)
                if (product && location) {
                    inventorySnapshotService.populateInventorySnapshots(location, product)
                }
                else if (location) {
                    inventorySnapshotService.populateInventorySnapshots(location)
                }

                log.info "Refreshed inventory snapshot table for location ${location?.name} and date ${date}: ${(System.currentTimeMillis() - startTime)} ms"

            } catch (Exception e) {
                log.error("Exception occurred while executing refresh location=${locationId}, user=${userId}: " + e.message, e)
            }
        }
    }
}
