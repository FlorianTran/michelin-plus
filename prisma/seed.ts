// Michelin+ — Grip · seed entrypoint (delegates to the shared demo seed).
import { PrismaClient } from '@prisma/client';
import { seedDemo, DEMO_PASSWORD } from '../src/lib/seed-demo';

const prisma = new PrismaClient();

async function main() {
  await seedDemo(prisma);
  console.log('✓ Seed complete');
  console.log(`  Léa    → lea@michelin.plus / ${DEMO_PASSWORD} (member, Titane)`);
  console.log(`  Thomas → thomas@michelin.plus / ${DEMO_PASSWORD} (ambassador, Carbone)`);
  console.log('  Codes: GRIP-2000, MICH-CLASSIC, CARBON-CDM, PILOT-SPORT, AMBASS-2026');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
