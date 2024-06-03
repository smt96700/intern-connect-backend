const { query } = require("../dbconfig/dbconfig");

const getAllJobs = async (req, res) => {
  try {
    const jobs = `
        SELECT * FROM jobs
        WHERE expired= ?
        `;
    console.log("getting jobs from database");
    const jobsObj = await query({
      query: jobs,
      values: [false]
    })

    // console.log("received jobs", jobsObj);
    return res.status(200).json({
      success: true,
      jobs: jobsObj
    })
  } catch (error) {
    console.log("Error at fetching jobs from database");
    res.status(500).json({
      status: 500,
      error: "Error at fetching jobs from database"
    })
  }
};

const postJob = async (req, res) => {
  try {
    const { userType } = await req.user;
    if (userType === 'student') {
      throw new Error("Student is not allowed to access post a job");
    }

    const {
      title,
      description,
      category,
      country: countryObj,
      state: stateObj,
      city: cityObj,
      location,
      fixedSalary: receivedFixedSalary,
      salaryFrom: receivedSalaryFrom,
      salaryTo: receivedSalaryTo,
      companyName,
      postedBy
    } = await req.body;

    const fixedSalary = receivedFixedSalary === "" ? null : receivedFixedSalary;
    const salaryFrom = receivedSalaryFrom === "" ? null : receivedSalaryFrom;
    const salaryTo = receivedSalaryTo === "" ? null : receivedSalaryTo;
    const country = countryObj.label;
    const state = stateObj.label;
    const city = cityObj.label;
    console.log("title", title);
    console.log("description", description);
    console.log("category", category);
    console.log("country", country);
    console.log("state", state);
    console.log("city", city);
    console.log("location", location);
    console.log("fixedfixedSalary", fixedSalary);
    console.log("salaryFrom", salaryFrom);
    console.log("salaryTo", salaryTo);
    console.log("companyName", companyName);
    console.log("postedBy", postedBy);


    if (!title || !description || !category || !country || !state || !city || !location) {
      throw new Error("Please Provide full job details");
    }

    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
      throw new Error("Please either provide fixed salary or ranged salary");
    }

    if (salaryFrom && salaryTo && fixedSalary) {
      throw new Error("Cannot Enter fixed and ranged salary together");
    }

    const createJob = `
          INSERT INTO jobs(
          title,
          description,
          category,
          country,
          state,
          city,
          location,
          fixedSalary,
          salaryFrom,
          salaryTo,
          companyName,
          postedBy
          ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
    const jobObj = await query({
      query: createJob,
      values: [title, description, category, country, state, city, location, fixedSalary, salaryFrom, salaryTo, companyName, postedBy]
    })
    if (jobObj.affectedRows > 0) {
      const insertedJobId = jobObj.insertId;
      const [insertedJob] = await query({
        query: 'SELECT * FROM jobs WHERE id = ?',
        values: [insertedJobId]
      });
      console.log("Job added successfully");
      res.status(200).json({
        success: true,
        message: "Job Posted Successfully",
        job: insertedJob
      });
    }
   
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const getMyJobs = async (req, res) => {
  try {
    const { userType, userid } = req.user;
    if (userType === "student") {
      throw new Error("Student is not allowed to access this resource");
    }
    const findMyJobsQuery = `
    SELECT * FROM jobs
    WHERE postedBy= ?
    `;
    console.log("finding jobs of particular admin")
    const myJobs = await query({
      query: findMyJobsQuery,
      values: [userid]
    });
    console.log("Jobs of particular admin found");
    res.status(200).json({
      success: true,
      myJobs
    });

  } catch (error) {
    console.error('Error at finding jobs of admin ', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const { userType } = req.user;
    if (userType === 'student') {
      throw new Error('Student is not allowed to edit a job');
    }

    const { id } = req.params;

    // Find the job
    const findJobQuery = `
        SELECT * FROM jobs
        WHERE id = ?
      `;
    const [jobObj] = await query({
      query: findJobQuery,
      values: [id],
    });

    if (!jobObj) {
      throw new Error('Job not found');
    }

    console.log('Job found within the database');

    // Destructure the fields from the request body
    const {
      title, description, category, country, city,
      location, fixedSalary, salaryFrom, salaryTo,
      companyName, expired
    } = req.body;
    console.log("inside update expired", expired);
    // Create an object with the existing job data and override it with the new data
    const updatedJobData = {
      title: title || jobObj.title,
      description: description || jobObj.description,
      category: category || jobObj.category,
      country: country || jobObj.country,
      city: city || jobObj.city,
      location: location || jobObj.location,
      fixedSalary: fixedSalary || jobObj.fixedSalary,
      salaryFrom: salaryFrom || jobObj.salaryFrom,
      salaryTo: salaryTo || jobObj.salaryTo,
      companyName: companyName || jobObj.companyName,
      expired: expired ?? jobObj.expired,
    };
    // expired === "false" ? false : expired === "true" ? true : jobObj.expired
    // Dynamically build the update query and values
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updatedJobData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id); // Add the job ID at the end for the WHERE clause

    const updateJobQuery = `
        UPDATE jobs 
        SET ${fields.join(', ')}
        WHERE id = ?
      `;
    console.log("values", values)
    const updatedJob = await query({
      query: updateJobQuery,
      values,
    });

    res.status(200).json({
      success: true,
      message: 'Job Updated Successfully'
    });

  } catch (error) {
    console.error('Error updating the job', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteJob = async (req, res) => {
  try {
    const { userType } = req.user;
    if (userType === 'student') {
      throw new Error('Student is not allowed to delete a job');
    }

    const { id } = req.params;

    // Find the job
    const findJobQuery = `
        SELECT * FROM jobs
        WHERE id = ?
      `;
    const [jobObj] = await query({
      query: findJobQuery,
      values: [id],
    });

    if (!jobObj) {
      throw new Error('Job not found');
    }

    console.log('Job found within the database');

    // Delete the job
    const deleteJobQuery = `
        DELETE FROM jobs
        WHERE id = ?
      `;
    await query({
      query: deleteJobQuery,
      values: [id]
    });

    res.status(200).json({
      success: true,
      message: 'Job Deleted Successfully',
    });

  } catch (error) {
    console.error('Error deleting the job', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleJob = async (req, res) => {
  try {

    const { id } = req.params;
    const findJobQuery = `
      SELECT * FROM jobs
      WHERE id= ?
      `;

    const [jobObj] = await query({
      query: findJobQuery,
      values: [id]
    });

    if (jobObj.length === 0) {
      throw new Error("Job not found");
    }
    console.log("Found Job", jobObj);
    res.status(200).json({
      success: true,
      job: jobObj
    })
  } catch (error) {
    console.log("Error at fetching single job", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAllJobs, postJob, updateJob, deleteJob, getSingleJob, getMyJobs };