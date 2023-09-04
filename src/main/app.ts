import { type AddPropertyDTO } from '../data/dtos';
import { AUTO_CONNECT, FORCE, PROPERTY_BOX } from '../util';
import { makeApp } from './factories';
import { handleRerun } from './handle-rerun';

const main = async (): Promise<void> => {
  let previousProperty: AddPropertyDTO | null = null;

  const { remoteGetUser, remoteAddClient, remoteAddProperty, logReportHelper } = makeApp();
  while (true) {
    try {
      if (previousProperty) {
        await remoteAddProperty.add({ ...previousProperty, previous: true });
      }
      const { code, name, observation, address } = await remoteGetUser.get();
      const { id } = await remoteAddClient.add({ code, name, observation });
      const propertyData: AddPropertyDTO = {
        address,
        client: id,
        box: PROPERTY_BOX,
        auto_connect: AUTO_CONNECT,
        force: FORCE
      };
      await remoteAddProperty.add(propertyData);
      previousProperty = propertyData;
      await logReportHelper.generateReport();
      await handleRerun();
    } catch {
      await logReportHelper.generateReport();
    }
  }
};

main()
  .then()
  .catch((error) => {
    console.error(error);
  });
