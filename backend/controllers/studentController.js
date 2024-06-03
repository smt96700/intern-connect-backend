const { query } = require('../dbconfig/dbconfig');
const { decodejwt } = require('../helpers/decodejwt');
const cloudinary = require('cloudinary').v2
const stream = require('stream');

//SOMESH
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET
// })

//SUMIT
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET
})

const dashboard = async (req, res) => {
  try {
    console.log("REquest accepted")
    const userid = req.query.userid

    const findStudentQuery = `
            SELECT * FROM profiles_student_view
            WHERE userid = ?
        `;

    const user = await query({
      query: findStudentQuery,
      values: [userid]
    });

    console.log("unique user: ", user);

    res.status(200).json({
      message: user[0],
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

const createProfile = async (req, res) => {
  try {
    const { userid } = req.body;
    console.log("UserId in creating Profile: ", userid)
    const query1 = `
    INSERT INTO profiles_student (userid)
    VALUES (?)
    `

    const user = await query({
      query: query1,
      values: [userid]
    })

    // const query2 = `
    //   UPDATE users_student
    //   SET profilecreated = 1
    //   WHERE userid = ?
    // `

    // const updatedUser = await query({
    //   query: query2,
    //   values: [userid]
    // })

    res.status(200).json({
      user: user[0]
    })
  } catch (error) {
    console.log("Error in creating Profile", error);
    res.status(500).json({
      message: error.message,
    })
  }
}

const updateProfile = async (req, res) => {
  console.log("Inside update Profile")
  try {
    const {
      profilecreated,
      userid,
      firstName,
      lastName,
      college,
      course,
      branch,
      year,
      cpi,
      profilePicturePath,
      resumePath,
      project1,
      project2,
      gitHub,
      linkedIn,
      phoneNumber,
      address,
      city,
      country,
      postalCode,
    } = req.body;

    const { githubLink: project1_githubLink, projectLink: project1_projectLink, demoLink: project1_demoLink } = project1 || {};
    const { githubLink: project2_githubLink, projectLink: project2_projectLink, demoLink: project2_demoLink } = project2 || {};


    // Initialize query parts
    const queryParts = [];
    const values = [];

    // Helper function to add a field to the query and values if it's not an empty string
    const addFieldToUpdate = (field, value) => {
      if (value !== undefined && value !== '') {
        queryParts.push(`${field} = ?`);
        values.push(value);
      }
    };

    // Add fields to the query if they are not empty
    addFieldToUpdate('first_name', firstName);
    addFieldToUpdate('last_name', lastName);
    addFieldToUpdate('college', college);
    addFieldToUpdate('course', course);
    addFieldToUpdate('branch', branch);
    addFieldToUpdate('year', year);
    addFieldToUpdate('cpi', cpi);
    addFieldToUpdate('profile_picture', profilePicturePath);
    addFieldToUpdate('resume', resumePath);
    addFieldToUpdate('project1_github_link', project1_githubLink);
    addFieldToUpdate('project1_project_link', project1_projectLink);
    addFieldToUpdate('project1_demo_link', project1_demoLink);
    addFieldToUpdate('project2_github_link', project2_githubLink);
    addFieldToUpdate('project2_project_link', project2_projectLink);
    addFieldToUpdate('project2_demo_link', project2_demoLink);
    addFieldToUpdate('github', gitHub);
    addFieldToUpdate('linkedin', linkedIn);
    addFieldToUpdate('phoneNumber', phoneNumber);
    addFieldToUpdate('address', address);
    addFieldToUpdate('city', city);
    addFieldToUpdate('country', country);
    addFieldToUpdate('postal_code', postalCode);

    // If there are no fields to update, return an error
    if (queryParts.length === 0) {
      return res.status(200).json({ message: 'No fields to update' });
    }

    // Add the userid to the values array for the WHERE clause
    values.push(userid);

    // Construct the final query
    const updateProfileQuery = `
      UPDATE profiles_student
      SET ${queryParts.join(', ')}
      WHERE userid = ?
    `;

    // Execute the query
    await query({
      query: updateProfileQuery,
      values: values
    });
    if (profilecreated == 0) {
      const query2 = `
      UPDATE users_student
      SET profilecreated = 1
      WHERE userid = ?
    `

    const updatedUser = await query({
      query: query2,
      values: [userid]
    })
    }

    const getQuery = `
      SELECT * FROM profiles_student_view
      WHERE userid = ?
    `

    const user = await query({
      query : getQuery,
      values : [userid]
    })

    res.status(200).json({ message: 'Profile Updated Successfully', info : user[0]});
  } catch (error) {
    console.error('Error in updating profile', error);
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

const uploadFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  });
};

const uploadProfile = async (req, res) => {
  console.log("inside main uploading func");

  if (!req.files || !req.files.profilePicture) {
    return res.status(400).send({ error: 'Files are missing' });
  }

  try {
    const profilePictureBuffer = req.files.profilePicture[0].buffer;
    console.log("File buffers:", profilePictureBuffer);

    // Upload both files concurrently
    const [profilePictureResult] = await Promise.all([
      uploadFromBuffer(profilePictureBuffer, { resource_type: 'image' }),
    ]);

    res.send({
      profilePictureUrl: profilePictureResult.secure_url,
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).send({ error: 'Upload to Cloudinary failed' });
  }
};

const uploadResume = async (req, res) => {
  console.log("inside main uploading func");

  if (!req.files || !req.files.resume) {
    return res.status(400).send({ error: 'Files are missing' });
  }

  try {
    const resumeBuffer = req.files.resume[0].buffer;
    console.log("File buffers:", resumeBuffer);

    const resumeResult = await uploadFromBuffer(resumeBuffer, { resource_type: 'raw', format: 'pdf' });

    res.send({
      resumeUrl: resumeResult.secure_url,
      resumePublicId: resumeResult.public_id
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).send({ error: 'Upload to Cloudinary failed' });
  }
};



module.exports = { dashboard, updateProfile, uploadProfile, uploadResume, createProfile };
