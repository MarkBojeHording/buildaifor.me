/**
 * Leads API Routes
 * Handles lead data management, storage, and analytics
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Import utilities
const logger = require('../../utils/logger');
const validators = require('../../utils/validators');

// Lead storage (in production, this would be a database)
const leadsFile = path.join(__dirname, '../../data/leads.json');

/**
 * Ensure leads file exists
 */
function ensureLeadsFile() {
    if (!fs.existsSync(leadsFile)) {
        const dir = path.dirname(leadsFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));
    }
}

/**
 * Load leads from file
 */
function loadLeads() {
    ensureLeadsFile();
    try {
        const data = fs.readFileSync(leadsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        logger.error('Failed to load leads:', error);
        return [];
    }
}

/**
 * Save leads to file
 */
function saveLeads(leads) {
    ensureLeadsFile();
    try {
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
        return true;
    } catch (error) {
        logger.error('Failed to save leads:', error);
        return false;
    }
}

/**
 * POST /api/leads
 * Create new lead
 */
router.post('/', (req, res) => {
    try {
        const leadData = req.body;

        // Validate lead data
        const validation = validators.validateLeadData(leadData);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Invalid lead data',
                details: validation.errors
            });
        }

        const leads = loadLeads();

        // Create new lead
        const newLead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...leadData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'new',
            score: leadData.score || 0,
            source: leadData.source || 'chatbot'
        };

        leads.push(newLead);

        if (saveLeads(leads)) {
            logger.info('New lead created', {
                leadId: newLead.id,
                clientId: leadData.client_id,
                score: newLead.score
            });

            res.status(201).json({
                success: true,
                message: 'Lead created successfully',
                lead: newLead
            });
        } else {
            throw new Error('Failed to save lead');
        }

    } catch (error) {
        logger.error('Create lead error:', error);

        res.status(500).json({
            error: 'Failed to create lead',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * GET /api/leads
 * Get leads with filtering and pagination
 */
router.get('/', (req, res) => {
    try {
        const {
            client_id,
            status,
            source,
            start_date,
            end_date,
            page = 1,
            limit = 50,
            sort_by = 'created_at',
            sort_order = 'desc'
        } = req.query;

        let leads = loadLeads();

        // Filter leads
        if (client_id) {
            leads = leads.filter(lead => lead.client_id === client_id);
        }

        if (status) {
            leads = leads.filter(lead => lead.status === status);
        }

        if (source) {
            leads = leads.filter(lead => lead.source === source);
        }

        if (start_date) {
            const start = new Date(start_date);
            leads = leads.filter(lead => new Date(lead.created_at) >= start);
        }

        if (end_date) {
            const end = new Date(end_date);
            leads = leads.filter(lead => new Date(lead.created_at) <= end);
        }

        // Sort leads
        leads.sort((a, b) => {
            let aVal = a[sort_by];
            let bVal = b[sort_by];

            if (sort_by === 'created_at' || sort_by === 'updated_at') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (sort_order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        // Pagination
        const totalLeads = leads.length;
        const totalPages = Math.ceil(totalLeads / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedLeads = leads.slice(startIndex, endIndex);

        res.json({
            success: true,
            leads: paginatedLeads,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalLeads,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        logger.error('Get leads error:', error);

        res.status(500).json({
            error: 'Failed to retrieve leads',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * GET /api/leads/:leadId
 * Get specific lead
 */
router.get('/:leadId', (req, res) => {
    try {
        const { leadId } = req.params;
        const leads = loadLeads();

        const lead = leads.find(l => l.id === leadId);

        if (!lead) {
            return res.status(404).json({
                error: 'Lead not found',
                leadId
            });
        }

        res.json({
            success: true,
            lead
        });

    } catch (error) {
        logger.error('Get lead error:', error);

        res.status(500).json({
            error: 'Failed to retrieve lead',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * PUT /api/leads/:leadId
 * Update lead
 */
router.put('/:leadId', (req, res) => {
    try {
        const { leadId } = req.params;
        const updates = req.body;

        // Validate updates
        const validation = validators.validateLeadUpdate(updates);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Invalid lead data',
                details: validation.errors
            });
        }

        const leads = loadLeads();
        const leadIndex = leads.findIndex(l => l.id === leadId);

        if (leadIndex === -1) {
            return res.status(404).json({
                error: 'Lead not found',
                leadId
            });
        }

        // Update lead
        leads[leadIndex] = {
            ...leads[leadIndex],
            ...updates,
            updated_at: new Date().toISOString()
        };

        if (saveLeads(leads)) {
            logger.info('Lead updated', {
                leadId,
                updatedFields: Object.keys(updates)
            });

            res.json({
                success: true,
                message: 'Lead updated successfully',
                lead: leads[leadIndex]
            });
        } else {
            throw new Error('Failed to save lead');
        }

    } catch (error) {
        logger.error('Update lead error:', error);

        res.status(500).json({
            error: 'Failed to update lead',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * DELETE /api/leads/:leadId
 * Delete lead
 */
router.delete('/:leadId', (req, res) => {
    try {
        const { leadId } = req.params;
        const leads = loadLeads();

        const leadIndex = leads.findIndex(l => l.id === leadId);

        if (leadIndex === -1) {
            return res.status(404).json({
                error: 'Lead not found',
                leadId
            });
        }

        const deletedLead = leads.splice(leadIndex, 1)[0];

        if (saveLeads(leads)) {
            logger.info('Lead deleted', {
                leadId
            });

            res.json({
                success: true,
                message: 'Lead deleted successfully',
                lead: deletedLead
            });
        } else {
            throw new Error('Failed to save leads');
        }

    } catch (error) {
        logger.error('Delete lead error:', error);

        res.status(500).json({
            error: 'Failed to delete lead',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * GET /api/leads/analytics/summary
 * Get lead analytics summary
 */
router.get('/analytics/summary', (req, res) => {
    try {
        const { client_id, start_date, end_date } = req.query;
        let leads = loadLeads();

        // Filter by client if specified
        if (client_id) {
            leads = leads.filter(lead => lead.client_id === client_id);
        }

        // Filter by date range if specified
        if (start_date) {
            const start = new Date(start_date);
            leads = leads.filter(lead => new Date(lead.created_at) >= start);
        }

        if (end_date) {
            const end = new Date(end_date);
            leads = leads.filter(lead => new Date(lead.created_at) <= end);
        }

        // Calculate analytics
        const totalLeads = leads.length;
        const newLeads = leads.filter(lead => lead.status === 'new').length;
        const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
        const convertedLeads = leads.filter(lead => lead.status === 'converted').length;

        const averageScore = totalLeads > 0
            ? leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / totalLeads
            : 0;

        const sourceBreakdown = leads.reduce((acc, lead) => {
            const source = lead.source || 'unknown';
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {});

        const dailyLeads = leads.reduce((acc, lead) => {
            const date = lead.created_at.split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            analytics: {
                totalLeads,
                newLeads,
                qualifiedLeads,
                convertedLeads,
                averageScore: Math.round(averageScore * 100) / 100,
                conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0,
                sourceBreakdown,
                dailyLeads,
                dateRange: {
                    start: start_date || 'all',
                    end: end_date || 'all'
                }
            }
        });

    } catch (error) {
        logger.error('Get analytics error:', error);

        res.status(500).json({
            error: 'Failed to retrieve analytics',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * POST /api/leads/:leadId/status
 * Update lead status
 */
router.post('/:leadId/status', (req, res) => {
    try {
        const { leadId } = req.params;
        const { status, notes } = req.body;

        if (!status) {
            return res.status(400).json({
                error: 'Status is required'
            });
        }

        const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status',
                validStatuses
            });
        }

        const leads = loadLeads();
        const leadIndex = leads.findIndex(l => l.id === leadId);

        if (leadIndex === -1) {
            return res.status(404).json({
                error: 'Lead not found',
                leadId
            });
        }

        // Update status
        leads[leadIndex].status = status;
        leads[leadIndex].updated_at = new Date().toISOString();

        if (notes) {
            if (!leads[leadIndex].notes) {
                leads[leadIndex].notes = [];
            }
            leads[leadIndex].notes.push({
                text: notes,
                timestamp: new Date().toISOString()
            });
        }

        if (saveLeads(leads)) {
            logger.info('Lead status updated', {
                leadId,
                status,
                hasNotes: !!notes
            });

            res.json({
                success: true,
                message: 'Lead status updated successfully',
                lead: leads[leadIndex]
            });
        } else {
            throw new Error('Failed to save lead');
        }

    } catch (error) {
        logger.error('Update lead status error:', error);

        res.status(500).json({
            error: 'Failed to update lead status',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * POST /api/leads/export
 * Export leads to CSV
 */
router.post('/export', (req, res) => {
    try {
        const { client_id, format = 'csv' } = req.body;
        let leads = loadLeads();

        // Filter by client if specified
        if (client_id) {
            leads = leads.filter(lead => lead.client_id === client_id);
        }

        if (format === 'csv') {
            // Generate CSV
            const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Score', 'Source', 'Created At'];
            const csvData = leads.map(lead => [
                lead.id,
                lead.name || '',
                lead.email || '',
                lead.phone || '',
                lead.status || '',
                lead.score || 0,
                lead.source || '',
                lead.created_at || ''
            ]);

            const csv = [headers, ...csvData]
                .map(row => row.map(field => `"${field}"`).join(','))
                .join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="leads_${Date.now()}.csv"`);
            res.send(csv);
        } else {
            res.status(400).json({
                error: 'Unsupported export format',
                supportedFormats: ['csv']
            });
        }

    } catch (error) {
        logger.error('Export leads error:', error);

        res.status(500).json({
            error: 'Failed to export leads',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * POST /api/leads
 * Create new lead
 */
router.post('/', (req, res) => {
  // Accept lead data and return a success response (mock)
  res.json({ success: true, message: 'Lead captured', data: req.body });
});

module.exports = router;
