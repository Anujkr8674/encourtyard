const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
  try {
    const images = await prisma.galleryImage.findMany();
    console.log('Found images:', images.map(img => img.id));
    if (images.length > 0) {
      console.log('Trying to delete image with ID:', images[0].id);
      const res = await prisma.galleryImage.delete({
        where: { id: images[0].id }
      });
      console.log('Delete success:', res);
    } else {
      console.log('No images to delete.');
    }
  } catch (err) {
    console.error('Error deleting:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
