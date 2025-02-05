import db from "../models/index.js";

export async function createContactInfo() {
    try {

        const contactInfo = await db.ContactInfo.count()

        if (contactInfo > 0) {
            console.log("Contact Infos exist")
        }
        else {
            const infos = await db.ContactInfo.create({ 
                email: 'info@orientaloilbd.com',
                phone: '202-555-0188',
                telephone: '(880-2) 55048284-6',
                officeAddress: 'The Alliance Building (10th floor) 63 Pragati Sarani, Dhaka-1212 Bangladesh',
                factoryAddress: 'Oriental Oil Company Ltd. 126, Samta, Jamtala, Navaron, Benapole, Bangladesh',
                facebook: 'https://facebook.com',
                linkedIn: 'https://linkedin.com',
                aboutUs: "<p></p>"
            })

            console.log("Contact Infos added successfully with Id:", infos.id)
        }
    } catch (error) {
        console.error('Error adding default Contact Infos:', err.message);
        throw err;
    }
}